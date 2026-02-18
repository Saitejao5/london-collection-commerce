import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919985542871";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display text-lg tracking-widest uppercase mb-4">
            <span className="gold-text">London</span> Collection
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Affordable luxury jewelry, watches & handbags. Delivered across Kuwait.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-gold">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop/Bangles" className="hover:text-gold transition-colors">Bangles</Link></li>
            <li><Link to="/shop/Necklaces" className="hover:text-gold transition-colors">Necklaces</Link></li>
            <li><Link to="/shop/Earrings" className="hover:text-gold transition-colors">Earrings</Link></li>
            <li><Link to="/shop/Watches" className="hover:text-gold transition-colors">Watches</Link></li>
            <li><Link to="/shop/Handbags" className="hover:text-gold transition-colors">Handbags</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-gold">Help</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/track-order" className="hover:text-gold transition-colors">Track Order</Link></li>
            <li><span className="hover:text-gold transition-colors cursor-pointer">Delivery Info</span></li>
            <li><span className="hover:text-gold transition-colors cursor-pointer">Returns</span></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm uppercase tracking-wider mb-4 text-gold">Contact</h4>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello London Collection!")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
          >
            <MessageCircle size={16} /> WhatsApp Us
          </a>
          <p className="text-sm text-muted-foreground mt-2">Kuwait City, Kuwait</p>
        </div>
      </div>
      <div className="border-t border-border/20 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} London Collection. All rights reserved.
      </div>
    </footer>
  );
}
