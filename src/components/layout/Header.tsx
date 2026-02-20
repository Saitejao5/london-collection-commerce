import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Menu, X, LogOut } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Bangles", to: "/shop/Bangles" },
  { label: "Necklaces", to: "/shop/Necklaces" },
  { label: "Earrings", to: "/shop/Earrings" },
  { label: "Watches", to: "/shop/Watches" },
  { label: "Handbags", to: "/shop/Handbags" },
];

export default function Header() {
  const itemCount = useCartStore((s) => s.itemCount());
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 bg-secondary text-secondary-foreground">
      <div className="container flex items-center justify-between py-3">
        {/* Mobile menu toggle */}
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <Link to="/" className="font-display text-xl md:text-2xl tracking-widest uppercase">
          <span className="gold-text">London</span> Collection
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm tracking-wide uppercase">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-gold transition-colors duration-200">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden lg:block text-xs text-secondary-foreground/60 max-w-[120px] truncate">
              {user.email}
            </span>
          )}
          <Link to="/wishlist" className="hover:text-gold transition-colors" aria-label="Wishlist">
            <Heart size={20} />
          </Link>
          <Link to="/cart" className="relative hover:text-gold transition-colors" aria-label="Cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={handleSignOut}
            className="hover:text-gold transition-colors"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border/20"
          >
            <div className="container flex flex-col gap-3 py-4 text-sm uppercase tracking-wide">
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="hover:text-gold transition-colors">
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => { setMobileOpen(false); handleSignOut(); }}
                className="text-left hover:text-gold transition-colors flex items-center gap-2"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
