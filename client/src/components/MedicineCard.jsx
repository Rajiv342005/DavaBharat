import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import MedicineArt, { getCategoryStyle } from "./MedicineArt";

export default function MedicineCard({ medicine }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const style = getCategoryStyle(medicine.category);
  const saving = medicine.mrp - medicine.price;
  const discount = Math.round((saving / medicine.mrp) * 100);
  const outOfStock = medicine.stock <= 0;

  const handleAdd = () => {
    addToCart(medicine);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-lift">
      <Link to={`/medicines/${medicine._id}`} className="relative block">
        <div
          className="flex h-40 items-center justify-center"
          style={{ backgroundColor: style.tint }}
        >
          {medicine.image ? (
            <img src={medicine.image} alt={medicine.name} className="h-full object-contain" />
          ) : (
            <MedicineArt category={medicine.category} className="h-28 w-28" />
          )}
        </div>
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-saffron px-2 py-1 text-xs font-bold text-ink">
            {discount}% off
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium" style={{ color: style.dark }}>
          {medicine.category}
        </p>
        <Link
          to={`/medicines/${medicine._id}`}
          className="mt-1 line-clamp-2 min-h-[2.75rem] font-semibold leading-snug hover:text-brand"
        >
          {medicine.name}
        </Link>
        <p className="mt-1 text-xs text-ink/60">{medicine.packSize}</p>

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold">₹{medicine.price}</span>
            <span className="text-sm text-ink/45 line-through">₹{medicine.mrp}</span>
          </div>
          {saving > 0 && (
            <p className="text-xs font-semibold text-brand">You save ₹{saving}</p>
          )}

          <button
            onClick={handleAdd}
            disabled={outOfStock}
            className="btn-primary mt-3 w-full"
          >
            {outOfStock ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}