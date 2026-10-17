import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="px-4 py-20 text-center">
      <h1 className="text-5xl font-bold text-brand">404</h1>
      <p className="mt-3 text-gray-600">This page doesn't exist (or isn't built yet).</p>
      <Link to="/" className="mt-6 inline-block rounded-md bg-brand px-5 py-2 text-white hover:bg-brand-dark">
        Back to Home
      </Link>
    </div>
  );
}