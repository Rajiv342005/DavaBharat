import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { inr } from "../utils/format";

const STATUS_STYLES = {
  Placed: "bg-saffron-light text-ink",
  Shipped: "bg-blue-50 text-blue-800",
  Delivered: "bg-brand-light text-brand-dark",
  Cancelled: "bg-red-50 text-red-700",
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState(null); // { id, message }

  useEffect(() => {
    let ignore = false;
    api
      .get("/orders")
      .then(({ data }) => !ignore && setOrders(Array.isArray(data) ? data : []))
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  const handleCancel = async (id) => {
    setCancellingId(id);
    setCancelError(null);
    try {
      const { data } = await api.put(`/orders/${id}/cancel`);
      setOrders((prev) => prev.map((o) => (o._id === id ? data : o)));
      setConfirmId(null);
    } catch (err) {
      setCancelError({ id, message: getErrorMessage(err) });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold">My orders</h1>

      {loading && <p className="mt-6 text-ink/60">Loading your orders...</p>}
      {error && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 px-3 py-2 text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-8 rounded-xl border border-line bg-white p-10 text-center">
          <p className="text-lg font-semibold">You haven't placed any orders yet</p>
          <p className="mt-1 text-sm text-ink/60">Your orders will show up here.</p>
          <Link to="/medicines" className="btn-primary mt-5">
            Browse medicines
          </Link>
        </div>
      )}

      <div className="mt-6 space-y-5">
        {orders.map((order) => {
          const a = order.shippingAddress;
          return (
            <article key={order._id} className="overflow-hidden rounded-xl border border-line bg-white">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper px-5 py-3">
                <div>
                  <p className="font-semibold">Order {order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-ink/60">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    STATUS_STYLES[order.status] || "bg-paper text-ink"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <ul className="divide-y divide-line px-5">
                {order.items.map((item) => (
                  <li key={item._id || item.medicine} className="flex justify-between gap-4 py-3 text-sm">
                    <span>
                      <Link to={`/medicines/${item.medicine}`} className="font-medium hover:text-brand">
                        {item.name}
                      </Link>
                      <span className="text-ink/60"> x {item.qty}</span>
                    </span>
                    <span className="shrink-0 font-medium">{inr(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line px-5 py-4">
                <div className="text-sm">
                  <p className="font-semibold">Delivering to</p>
                  <p className="text-ink/70">
                    {a.fullName}, {a.phone}
                    <br />
                    {a.address}, {a.city} {a.pincode}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-ink/60">Total ({order.paymentMethod})</p>
                  <p className="font-display text-2xl font-bold">{inr(order.totalPrice)}</p>
                </div>
              </div>

              {/* Cancel */}
              {order.status === "Placed" && (
                <div className="border-t border-line px-5 py-3">
                  {confirmId === order._id ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-medium">Cancel this order?</span>
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={cancellingId === order._id}
                        className="btn bg-red-600 text-white hover:bg-red-700"
                      >
                        {cancellingId === order._id ? "Cancelling..." : "Yes, cancel order"}
                      </button>
                      <button onClick={() => setConfirmId(null)} className="btn-outline">
                        Keep order
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setConfirmId(order._id);
                        setCancelError(null);
                      }}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
                      Cancel order
                    </button>
                  )}

                  {cancelError?.id === order._id && (
                    <p role="alert" className="mt-2 text-sm text-red-700">
                      {cancelError.message}
                    </p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}