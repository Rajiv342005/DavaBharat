import mongoose from "mongoose";
import Medicine from "../models/Medicine.js";
import Order from "../models/Order.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

// POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  const { fullName, phone, address, city, pincode } = shippingAddress || {};
  if (!fullName || !phone || !address || !city || !pincode) {
    res.status(400);
    throw new Error("Please fill in all address fields");
  }
  if (!/^\d{10}$/.test(phone)) {
    res.status(400);
    throw new Error("Phone number must be 10 digits");
  }
  if (!/^\d{6}$/.test(pincode)) {
    res.status(400);
    throw new Error("Pincode must be 6 digits");
  }

  // Validate items and merge duplicates
  const qtyById = new Map();
  for (const item of items) {
    const id = String(item.medicine);
    const qty = Number(item.qty);
    if (!mongoose.isValidObjectId(id) || !Number.isInteger(qty) || qty < 1 || qty > 10) {
      res.status(400);
      throw new Error("Invalid item in cart (quantity must be 1 to 10)");
    }
    qtyById.set(id, (qtyById.get(id) || 0) + qty);
  }

  const reserved = []; // stock we have already taken, so we can undo on failure
  const orderItems = [];
  let totalPrice = 0;

  try {
    for (const [id, qty] of qtyById) {
      // Atomic: only decreases stock if enough is available
      const medicine = await Medicine.findOneAndUpdate(
        { _id: id, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );

      if (!medicine) {
        const existing = await Medicine.findById(id).select("name");
        res.status(400);
        throw new Error(
          existing
            ? `${existing.name} is out of stock or not available in that quantity`
            : "A medicine in your cart no longer exists"
        );
      }

      reserved.push({ id, qty });
      orderItems.push({
        medicine: medicine._id,
        name: medicine.name,
        image: medicine.image,
        price: medicine.price,
        qty,
      });
      totalPrice += medicine.price * qty;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: { fullName, phone, address, city, pincode },
      paymentMethod: "COD",
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    // Give back any stock we already took
    await Promise.all(
      reserved.map((r) => Medicine.updateOne({ _id: r.id }, { $inc: { stock: r.qty } }))
    );
    throw error;
  }
});

// GET /api/orders  (my orders)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error("Order not found");
  }
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.json(order);
});

// PUT /api/orders/:id/cancel
export const cancelOrder = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Only a "Placed" order can be cancelled
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id, status: "Placed" },
    { status: "Cancelled" },
    { new: true }
  );

  if (!order) {
    res.status(400);
    throw new Error("This order can't be cancelled");
  }

  // Return the stock
  await Promise.all(
    order.items.map((i) =>
      Medicine.updateOne({ _id: i.medicine }, { $inc: { stock: i.qty } })
    )
  );

  res.json(order);
});