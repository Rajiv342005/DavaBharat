import { Link } from "react-router-dom";
import { SITE_NAME } from "../config";

export default function Footer() {
  return (
    <footer className="mt-12 bg-ink text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-bold text-white">{SITE_NAME}</h3>
          <p className="mt-2 text-sm">Affordable generic medicines, delivered to your door.</p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/medicines" className="hover:text-white">All Medicines</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Policies</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/policy/terms" className="hover:text-white">Terms and Conditions</Link></li>
            <li><Link to="/policy/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/policy/shipping" className="hover:text-white">Shipping Policy</Link></li>
            <li><Link to="/policy/returns" className="hover:text-white">Return and Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Contact</h4>
          <p className="text-sm">care@example.com</p>
          <p className="text-sm">+91 00000 00000</p>
          <p className="mt-3 text-sm">We accept Cash on Delivery</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {SITE_NAME}. Demo project, not a real pharmacy.
      </div>
    </footer>
  );
}