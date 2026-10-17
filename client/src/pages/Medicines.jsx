import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";
import MedicineCard from "../components/MedicineCard";

const SORT_OPTIONS = [
  { value: "", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

export default function Medicines() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "";
  const page = Math.max(parseInt(searchParams.get("page")) || 1, 1);

  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({ medicines: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Change one or more URL params. Any filter change goes back to page 1.
  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries({ page: "", ...changes }).forEach(([key, value]) => {
      if (value && value !== "All") next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next);
  };

  // Load the category list once
  useEffect(() => {
    api
      .get("/medicines/categories")
      .then(({ data }) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Load medicines whenever the URL filters change
  useEffect(() => {
    let ignore = false; // ignore outdated responses
    setLoading(true);
    setError("");

    api
      .get("/medicines", { params: { search, category, sort, page, limit: 12 } })
      .then(({ data }) => {
        if (ignore) return;
        if (Array.isArray(data.medicines)) setData(data);
        else setError("Unexpected response from the server");
      })
      .catch((err) => !ignore && setError(getErrorMessage(err)))
      .finally(() => !ignore && setLoading(false));

    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      ignore = true;
    };
  }, [search, category, sort, page]);

  const hasFilters = search || category !== "All" || sort;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold">
        {search ? `Results for "${search}"` : category !== "All" ? category : "All Medicines"}
      </h1>
      {!loading && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {data.total} {data.total === 1 ? "medicine" : "medicines"} found
        </p>
      )}

      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        {/* Filters */}
        <aside className="md:w-56 md:shrink-0">
          <div className="rounded-xl border border-line bg-white p-4">
            <h2 className="mb-2 font-semibold">Category</h2>

            {/* Dropdown on mobile */}
            <select
              value={category}
              onChange={(e) => updateParams({ category: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:hidden"
            >
              {["All", ...categories].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* List on desktop */}
            <ul className="hidden space-y-1 md:block">
              {["All", ...categories].map((c) => (
                <li key={c}>
                  <button
                    onClick={() => updateParams({ category: c })}
                    className={`w-full rounded px-3 py-1.5 text-left text-sm ${
                      category === c
                        ? "bg-brand font-medium text-white"
                        : "hover:bg-brand-light"
                    }`}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>

            <h2 className="mb-2 mt-4 font-semibold">Sort by</h2>
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={() => setSearchParams({})}
                className="mt-4 w-full rounded-md border border-brand py-1.5 text-sm font-medium text-brand hover:bg-brand-light"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Results */}
        <section className="flex-1">
          {error && <p className="rounded bg-red-50 px-3 py-2 text-red-600">{error}</p>}

          {loading && <p className="text-gray-500">Loading medicines...</p>}

          {!loading && !error && data.medicines.length === 0 && (
            <div className="rounded-xl border border-line bg-white p-10 text-center">
              <p className="text-lg font-medium">No medicines found</p>
              <p className="mt-1 text-sm text-gray-500">Try a different search or clear the filters.</p>
            </div>
          )}

          {!loading && data.medicines.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {data.medicines.map((m) => (
                  <MedicineCard key={m._id} medicine={m} />
                ))}
              </div>

              {data.pages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    disabled={page <= 1}
                    onClick={() => updateParams({ page: String(page - 1) })}
                    className="rounded-md border bg-white px-4 py-2 text-sm hover:border-brand disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {data.pages}
                  </span>
                  <button
                    disabled={page >= data.pages}
                    onClick={() => updateParams({ page: String(page + 1) })}
                    className="rounded-md border bg-white px-4 py-2 text-sm hover:border-brand disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}