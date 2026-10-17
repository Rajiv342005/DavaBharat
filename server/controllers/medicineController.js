import mongoose from "mongoose";
import Medicine from "../models/Medicine.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/medicines?search=&category=&sort=&page=&limit=
export const getMedicines = asyncHandler(async (req, res) => {
  const { search, category, sort } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 12, 50);

  const filter = {};

  if (search && search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ name: regex }, { composition: regex }];
  }
  if (category && category !== "All") {
    filter.category = category;
  }

  const sortOptions = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name: { name: 1 },
  };

  const total = await Medicine.countDocuments(filter);
  const medicines = await Medicine.find(filter)
    .sort(sortOptions[sort] || { createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    medicines,
    page,
    pages: Math.ceil(total / limit),
    total,
  });
});

// GET /api/medicines/featured
export const getFeatured = asyncHandler(async (req, res) => {
  const medicines = await Medicine.find({ featured: true }).limit(8);
  res.json(medicines);
});

// GET /api/medicines/categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Medicine.distinct("category");
  res.json(categories.sort());
});

// GET /api/medicines/:id
export const getMedicineById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error("Medicine not found");
  }
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }
  res.json(medicine);
});