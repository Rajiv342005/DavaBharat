import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api, { getErrorMessage } from "../services/api";
import { inr } from "../utils/format";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 outline-none focus:border-brand";

export default function Checkout() {
  const { user } = useAuth();
  const { items, totalItems, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(form.phone)) {
      setError("Phone number must be 10 digits");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Pincode must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/orders", {
        items: items.map((i) => ({ medicine: i._id, qty: i.qty })),
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone,
          address: form.address.trim(),
          city: form.city.trim(),
          pincode: form.pincode,
        },
      });
      clearCart();
      setPlacedOrder(data);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (placedOrder) {
    const a = placedOrder.shippingAddress;
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 5 5 9-10" />
          </svg>
        </span>
        <h1 className="mt-6 text-3xl font-bold">Order placed</h1>
        <p className="mt-2 text-ink/70">
          Order number {placedOrder._id.slice(-8).toUpperCase()}. Please keep {inr(placedOrder.totalPrice)} ready to pay when it arrives.
        </p>

        <div className="mt-6 rounded-xl border border-line bg-white p-5 text-left text-sm">
          <p className="font-semibold">Delivering to</p>
          <p className="mt-1 text-ink/70">
            {a.fullName}, {a.phone}
            <br />
            {a.address}, {a.city} {a.pincode}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/orders" className="btn-primary">
            View my orders
          </Link>
          <Link to="/medicines" className="btn-outline">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  // Nothing to check out
  if (items.length === 0) return <Navigate to="/cart" replace />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Address */}
          <section className="rounded-xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Delivery address</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-1 block text-sm font-medium">Full name</label>
                <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-medium">Phone number</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} required maxLength={10} inputMode="numeric" placeholder="10 digits" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="mb-1 block text-sm font-medium">Address</label>
                <input id="address" name="address" value={form.address} onChange={handleChange} required placeholder="House no, street, area" className={inputClass} />
              </div>
              <div>
                <label htmlFor="city" className="mb-1 block text-sm font-medium">City</label>
                <input id="city" name="city" value={form.city} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label htmlFor="pincode" className="mb-1 block text-sm font-medium">Pincode</label>
                <input id="pincode" name="pincode" value={form.pincode} onChange={handleChange} required maxLength={6} inputMode="numeric" placeholder="6 digits" className={inputClass} />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-xl border border-line bg-white p-5">
            <h2 className="text-lg font-bold">Payment</h2>
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-brand bg-brand-light p-4">
              <span className="mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-brand bg-white" />
              <div>
                <p className="font-semibold">Cash on Delivery</p>
                <p className="text-sm text-ink/70">Pay in cash when your order arrives.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-xl border border-line bg-white p-5 lg:sticky lg:top-36">
          <h2 className="text-lg font-bold">
            Your order ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h2>

          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto text-sm">
            {items.map((i) => (
              <li key={i._id} className="flex justify-between gap-3">
                <span className="text-ink/80">
                  {i.name} <span className="text-ink/50">x {i.qty}</span>
                </span>
                <span className="shrink-0 font-medium">{inr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/70">Delivery</span>
              <span>Free</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total to pay</span>
              <span className="font-display text-2xl font-bold">{inr(totalPrice)}</span>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary mt-5 w-full py-3">
            {loading ? "Placing order..." : "Place order"}
          </button>
          <p className="mt-3 text-center text-xs text-ink/60">
            <Link to="/cart" className="underline">Back to cart</Link>
          </p>
        </aside>
      </form>
    </div>
  );
}