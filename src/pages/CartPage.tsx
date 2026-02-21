import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/formatPrice";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, deliveryFee, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 text-muted-foreground" size={48} />
        <h1 className="font-display text-2xl mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground text-sm font-body mb-6">Browse our collection and add something you love.</p>
        <Link to="/shop" className="gold-gradient text-primary-foreground font-body text-sm uppercase tracking-wider px-8 py-3 rounded inline-flex items-center gap-2">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <motion.div key={item.productId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-4 bg-card rounded p-4">
              <img src={item.image} alt={item.title} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded" />
              <div className="flex-1 min-w-0">
                <h3 className="font-body text-sm md:text-base truncate">{item.title}</h3>
                <p className="font-display text-gold text-sm mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-border rounded text-xs">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2 py-1 text-muted-foreground hover:text-foreground"><Minus size={12} /></button>
                    <span className="px-2 py-1 min-w-[1.5rem] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2 py-1 text-muted-foreground hover:text-foreground"><Plus size={12} /></button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="font-display text-sm text-foreground whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
            </motion.div>
          ))}
        </div>
        <div className="bg-card rounded p-6 h-fit sticky top-20">
          <h2 className="font-display text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm font-body">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal())}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{formatPrice(deliveryFee())}</span></div>
            <div className="border-t border-border pt-3 flex justify-between font-display text-base"><span>Total</span><span className="text-gold">{formatPrice(total())}</span></div>
          </div>
          <Link to="/checkout" className="gold-gradient text-primary-foreground font-body text-sm uppercase tracking-wider px-8 py-3 rounded w-full mt-6 inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            Checkout <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
