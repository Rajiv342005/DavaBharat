import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import MedicineCard from "../components/MedicineCard";
import MedicineArt, { getCategoryStyle } from "../components/MedicineArt";
import FAQ from "../components/FAQ";

const POPULAR = ["Paracetamol", "Metformin", "Vitamin D3", "Cetirizine"];

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5 9-10" />
  </svg>
);

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/medicines/featured"), api.get("/medicines/categories")])
      .then(([f, c]) => {
        setFeatured(Array.isArray(f.data) ? f.data : []);
        setCategories(Array.isArray(c.data) ? c.data : []);
      })
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/medicines?search=${encodeURIComponent(q)}` : "/medicines");
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-dark text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:grid-cols-[1.2fr_1fr] md:py-20">
          <div>
            <h1 className="max-w-xl text-4xl font-bold leading-[1.1] md:text-6xl">
              Same medicine. Lower price.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-white/80">
              Generic medicines with the same active ingredient as the brands you know,
              delivered to your door. Pay in cash when they arrive.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex max-w-lg rounded-xl bg-white p-1.5">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a medicine, e.g. Metformin"
                className="w-full bg-transparent px-3 text-ink outline-none placeholder:text-ink/40"
              />
              <button type="submit" className="btn-primary px-6">
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-white/70">Popular searches:</span>
              {POPULAR.map((p) => (
                <Link
                  key={p}
                  to={`/medicines?search=${encodeURIComponent(p)}`}
                  className="rounded-full border border-white/30 px-3 py-1 hover:bg-white/10"
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>

          {/* Price comparison */}
          <div className="rounded-2xl bg-white p-6 text-ink shadow-lift">
            <div className="flex items-center gap-4">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: getCategoryStyle("Diabetes").tint }}
              >
                <MedicineArt category="Diabetes" className="h-14 w-14" />
              </div>
              <div>
                <p className="font-semibold">Metformin Tablets IP 500mg</p>
                <p className="text-sm text-ink/60">Pack of 20 tablets</p>
              </div>
            </div>

            <dl className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <dt className="text-ink/60">Market price</dt>
                <dd className="text-ink/60 line-through">₹40</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-medium">Our price</dt>
                <dd className="font-display text-3xl font-bold text-brand">₹12</dd>
              </div>
            </dl>

            <p className="mt-5 rounded-lg bg-saffron-light px-3 py-2 text-sm font-semibold">
              You save ₹28 on this one pack
            </p>
            <p className="mt-3 text-xs text-ink/50">Sample from the demo catalog.</p>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-x-10 gap-y-3 px-4 py-4 text-sm font-medium">
          {[
            "Pay on delivery",
            "Up to 70% below market price",
            "Cancel any time before it ships",
          ].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <CheckIcon />
              {t}
            </span>
          ))}
        </div>
      </section>

      {error && <p className="mx-auto mt-6 max-w-7xl px-4 text-red-600">{error}</p>}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12">
          <h2 className="mb-5 text-2xl font-bold md:text-3xl">Shop by category</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/medicines?category=${encodeURIComponent(cat)}`}
                className="flex items-center gap-4 rounded-xl border border-line bg-white p-4 transition-colors hover:border-brand"
              >
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: getCategoryStyle(cat).tint }}
                >
                  <MedicineArt category={cat} className="h-10 w-10" />
                </span>
                <span className="font-semibold leading-snug">{cat}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-14">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Featured medicines</h2>
            <Link to="/medicines" className="text-sm font-semibold text-brand hover:underline">
              See all medicines
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((m) => (
              <MedicineCard key={m._id} medicine={m} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-6 text-center text-2xl font-bold md:text-3xl">Common questions</h2>
        <FAQ />
      </section>
    </div>
  );
}