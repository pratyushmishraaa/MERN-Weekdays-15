const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-extrabold text-white">
            Shop<span className="text-indigo-400">X</span>
          </h2>
          <p className="text-sm leading-relaxed">
            Your one-stop destination for quality products at unbeatable prices.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li><a href="/" className="hover:text-indigo-400 transition-colors">Home</a></li>
            <li><a href="/products" className="hover:text-indigo-400 transition-colors">Products</a></li>
            <li><a href="/cart" className="hover:text-indigo-400 transition-colors">Cart</a></li>
          </ul>
        </div>

        {/* Account */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Account</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li><a href="/login" className="hover:text-indigo-400 transition-colors">Login</a></li>
            <li><a href="/signup" className="hover:text-indigo-400 transition-colors">Sign Up</a></li>
            <li><a href="/profile" className="hover:text-indigo-400 transition-colors">My Profile</a></li>
            <li><a href="/orders" className="hover:text-indigo-400 transition-colors">My Orders</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Contact</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@shopx.com
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L8.5 10.5S9.5 13 11 14.5s4 2.5 4 2.5l1.113-1.724a1 1 0 011.21-.502l4.493 1.498A1 1 0 0123 17.72V21a2 2 0 01-2 2h-1C9.716 23 1 14.284 1 6V5z" />
              </svg>
              +1 (800) 123-4567
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex items-center gap-3 mt-2">
            <a href="#" aria-label="Twitter" className="hover:text-indigo-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-indigo-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="#" aria-label="GitHub" className="hover:text-indigo-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} ShopX. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
