import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import { useCart } from "../context/CartContext";
import MedicineArt, { getCategoryStyle } from "../components/MedicineArt";
export default function MedicineDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    setMedicine(null);
    setQty(1);
    setAdded(false);

    api
      .get(`/medicines/${id}`)
      .then(({ data }) => !ignore && setMedicine(data))
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));

    window.scrollTo({ top: 0 });
    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) return <p className="mx-auto max-w-7xl px-4 py-10 text-gray-500">Loading...</p>;

  if (error || !medicine) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-lg font-medium text-red-600">{error || "Medicine not found"}</p>
        <Link
          to="/medicines"
          className="mt-6 inline-block rounded-md bg-brand px-5 py-2 text-white hover:bg-brand-dark"
        >
          Back to Medicines
        </Link>
      </div>
    );
  }

  const discount = Math.round((1 - medicine.price / medicine.mrp) * 100);
  const outOfStock = medicine.stock <= 0;

  const handleAdd = () => {
    addToCart(medicine, qty);
    setAdded(true);
  };

  const details = [
    ["Composition", medicine.composition],
    ["Category", medicine.category],
    ["Manufacturer", medicine.manufacturer],
    ["Pack size", medicine.packSize],
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="mb-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-brand">Home</Link> /{" "}
        <Link to="/medicines" className="hover:text-brand">Medicines</Link> /{" "}
        <Link
          to={`/medicines?category=${encodeURIComponent(medicine.category)}`}
          className="hover:text-brand"
        >
          {medicine.category}
        </Link>
      </p>

      <div className="grid gap-8 rounded-lg bg-white p-6 shadow-sm md:grid-cols-2">
        {/* Image */}
  <div
    className="flex h-64 items-center justify-center rounded-xl md:h-80"
    style={{ backgroundColor: getCategoryStyle(medicine.category).tint }}
  >
    {medicine.image ? (
      <img src={medicine.image} alt={medicine.name} className="h-full object-contain" />
    ) : (
      <MedicineArt category={medicine.category} className="h-44 w-44" />
    )}
  </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-bold">{medicine.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{medicine.composition}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand">₹{medicine.price}</span>
            <span className="text-lg text-gray-400 line-through">₹{medicine.mrp}</span>
            {discount > 0 && (
              <span className="rounded bg-saffron px-2 py-0.5 text-sm font-bold text-ink">
                {discount}% OFF
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">Inclusive of all taxes</p>

          <p className={`mt-3 text-sm font-medium ${outOfStock ? "text-red-600" : "text-green-700"}`}>
            {outOfStock ? "Out of stock" : "In stock"}
          </p>

          {!outOfStock && (
            <div className="mt-5 flex items-center gap-4">
              <div className="flex items-center rounded-md border">
                <button
                  onClick={() => setQty((q) => Math.max(q - 1, 1))}
                  className="px-3 py-2 text-lg hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(q + 1, 10))}
                  className="px-3 py-2 text-lg hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 rounded-md bg-brand py-3 font-medium text-white hover:bg-brand-dark"
              >
                Add to Cart
              </button>
            </div>
          )}

          {added && (
            <p className="mt-3 text-sm text-green-700">
              Added to cart.{" "}
              <Link to="/cart" className="font-medium underline">
                Go to cart
              </Link>
            </p>
          )}

          <dl className="mt-6 divide-y rounded-md border text-sm">
            {details.map(([label, value]) =>
              value ? (
                <div key={label} className="flex px-4 py-2">
                  <dt className="w-32 shrink-0 text-gray-500">{label}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ) : null
            )}
          </dl>
        </div>
      </div>

      {medicine.description && (
        <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">About this product</h2>
          <p className="text-sm text-gray-600">{medicine.description}</p>
        </div>
      )}
    </div>
  );
}