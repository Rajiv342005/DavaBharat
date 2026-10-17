import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { SITE_NAME } from "../config";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const CartIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2l2.4 11h10.2L20 8H6.2" />
    <circle cx="9" cy="19.5" r="1.5" />
    <circle cx="17" cy="19.5" r="1.5" />
  </svg>
);

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/medicines/categories")
      .then(({ data }) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/medicines?search=${encodeURIComponent(q)}` : "/medicines");
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <div className="bg-ink px-4 py-1.5 text-center text-xs text-white/90">
        Cash on Delivery on every order. Generic medicines at up to 70% less than market price.
      </div>

      <header className="sticky top-0 z-50 border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span className="font-display text-xl font-bold">{SITE_NAME}</span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="order-last flex w-full items-center rounded-full border border-line bg-paper pl-4 focus-within:border-brand md:order-none md:max-w-xl md:flex-1"
          >
            <span className="text-ink/50">
              <SearchIcon />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by medicine name or composition"
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-ink/40"
            />
            <button type="submit" className="btn-primary m-1 rounded-full px-5 py-1.5">
              Search
            </button>
          </form>

          <nav className="ml-auto flex items-center gap-5">
            <Link to="/cart" className="relative text-ink hover:text-brand" aria-label="Cart">
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-saffron px-1 text-xs font-bold text-ink">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="text-sm font-semibold hover:text-brand"
                >
                  {user.name.split(" ")[0]} ▾
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-lg border border-line bg-white py-1 shadow-lift">
                    <Link
                      to="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm hover:bg-paper"
                    >
                      My orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-paper"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-outline py-2">
                Sign in
              </Link>
            )}
          </nav>
        </div>

        {/* Category row */}
        {categories.length > 0 && (
          <div className="border-t border-line">
            <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-2 text-sm font-medium text-ink/75">
              <Link to="/medicines" className="shrink-0 hover:text-brand">
                All medicines
              </Link>
              {categories.map((c) => (
                <Link
                  key={c}
                  to={`/medicines?category=${encodeURIComponent(c)}`}
                  className="shrink-0 hover:text-brand"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}