import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import MedicineArt, { getCategoryStyle } from "../components/MedicineArt";
import { inr } from "../utils/format";

export default function Cart() {
  const { items, updateQty, removeFromCart, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-ink/70">Find your medicines and add them here to order.</p>
        <Link to="/medicines" className="btn-primary mt-6">
          Browse medicines
        </Link>
      </div>
    );
  }

  const mrpTotal = items.reduce((sum, i) => sum + (i.mrp || i.price) * i.qty, 0);
  const savings = mrpTotal - totalPrice;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Your cart</h1>
      <p className="mt-1 text-sm text-ink/60">
        {totalItems} {totalItems === 1 ? "item" : "items"}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <ul className="divide-y divide-line self-start rounded-xl border border-line bg-white">
          {items.map((item) => (
            <li key={item._id} className="flex gap-4 p-4">
              <Link
                to={`/medicines/${item._id}`}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: getCategoryStyle(item.category).tint }}
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full object-contain" />
                ) : (
                  <MedicineArt category={item.category} className="h-14 w-14" />
                )}
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      to={`/medicines/${item._id}`}
                      className="font-semibold hover:text-brand"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-ink/60">{item.packSize}</p>
                    <p className="mt-1 text-sm text-ink/70">{inr(item.price)} each</p>
                  </div>
                  <p className="font-display text-lg font-bold">{inr(item.price * item.qty)}</p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border border-line">
                    <button
                      onClick={() => updateQty(item._id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="px-3 py-1.5 text-lg hover:bg-paper disabled:opacity-40"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>
                    <span className="w-9 text-center text-sm font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item._id, item.qty + 1)}
                      disabled={item.qty >= 10}
                      className="px-3 py-1.5 text-lg hover:bg-paper disabled:opacity-40"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="h-fit rounded-xl border border-line bg-white p-5 lg:sticky lg:top-36">
          <h2 className="text-lg font-bold">Order summary</h2>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/70">Market price ({totalItems} items)</dt>
              <dd>{inr(mrpTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/70">Discount</dt>
              <dd className="font-medium text-brand">− {inr(savings)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/70">Delivery</dt>
              <dd>Free</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-display text-2xl font-bold">{inr(totalPrice)}</span>
          </div>

          {savings > 0 && (
            <p className="mt-3 rounded-lg bg-saffron-light px-3 py-2 text-sm font-semibold">
              You save {inr(savings)} on this order
            </p>
          )}

          <Link to="/checkout" className="btn-primary mt-5 w-full py-3">
            Proceed to checkout
          </Link>
          <p className="mt-3 text-center text-xs text-ink/60">
            Pay in cash when your order arrives
          </p>
        </aside>
      </div>
    </div>
  );
}