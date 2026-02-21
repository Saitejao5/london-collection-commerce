import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

const WHATSAPP_NUMBER = "96599999999";

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", area: "", block: "", street: "", house: "", notes: "" });
  const [payment, setPayment] = useState<"COD" | "ONLINE">("COD");
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground font-body">Your cart is empty.</p>
        <Link to="/shop" className="text-gold text-sm mt-4 inline-block hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.area.trim()) {
      toast.error("Please fill in required fields");
      return;
    }
    setLoading(true);
    try {
      const orderNumber = `LC-${10000 + Math.floor(Math.random() * 90000)}`;
      const { data: order, error: orderErr } = await supabase.from("orders").insert({
        order_number: orderNumber,
        user_id: user!.id,
        status: "PLACED",
        payment_method: payment,
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        delivery_area: form.area.trim(),
        delivery_block: form.block.trim() || null,
        delivery_street: form.street.trim() || null,
        delivery_house: form.house.trim() || null,
        delivery_notes: form.notes.trim() || null,
        subtotal: subtotal(),
        delivery_fee: deliveryFee(),
        total: total(),
      }).select().single();

      if (orderErr) throw orderErr;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      clearCart();
      navigate(`/order-success?order=${orderNumber}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const waMsg = encodeURIComponent(
    `Hello London Collection,\nI want to order:\n\n${items.map(i => `${i.title} x${i.quantity} = ${formatPrice(i.price * i.quantity)}`).join("\n")}\n\nTotal: ${formatPrice(total())}\n\nName: ${form.name}\nPhone: ${form.phone}\nArea: ${form.area}, Block ${form.block}, Street ${form.street}, House ${form.house}\nNotes: ${form.notes}`
  );

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded p-6">
            <h2 className="font-display text-lg mb-4">Delivery Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="name" value={form.name} onChange={onChange} placeholder="Full Name *" required maxLength={100} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring" />
              <input name="phone" value={form.phone} onChange={onChange} placeholder="Phone Number *" required maxLength={20} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring" />
              <input name="area" value={form.area} onChange={onChange} placeholder="Area *" required maxLength={100} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring" />
              <input name="block" value={form.block} onChange={onChange} placeholder="Block" maxLength={20} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring" />
              <input name="street" value={form.street} onChange={onChange} placeholder="Street" maxLength={100} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring" />
              <input name="house" value={form.house} onChange={onChange} placeholder="House / Apt" maxLength={50} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Delivery notes (optional)" maxLength={500} rows={2} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring mt-4" />
          </div>
          <div className="bg-card rounded p-6">
            <h2 className="font-display text-lg mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-4 rounded border cursor-pointer transition-colors ${payment === "COD" ? "border-gold bg-gold/5" : "border-border"}`}>
                <input type="radio" name="payment" checked={payment === "COD"} onChange={() => setPayment("COD")} className="accent-gold" />
                <div><p className="font-body text-sm font-medium">Cash on Delivery</p><p className="text-xs text-muted-foreground font-body">Pay when you receive your order</p></div>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded border cursor-pointer transition-colors ${payment === "ONLINE" ? "border-gold bg-gold/5" : "border-border"}`}>
                <input type="radio" name="payment" checked={payment === "ONLINE"} onChange={() => setPayment("ONLINE")} className="accent-gold" />
                <div><p className="font-body text-sm font-medium">Online Payment</p><p className="text-xs text-muted-foreground font-body">UPI / Card / Net Banking</p></div>
              </label>
            </div>
          </div>
        </div>
        <div className="bg-card rounded p-6 h-fit sticky top-20">
          <h2 className="font-display text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground truncate mr-2">{item.title} ×{item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 space-y-2 text-sm font-body">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal())}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{formatPrice(deliveryFee())}</span></div>
            <div className="border-t border-border pt-3 flex justify-between font-display text-base"><span>Total</span><span className="text-gold">{formatPrice(total())}</span></div>
          </div>
          <button type="submit" disabled={loading} className="gold-gradient text-primary-foreground font-body text-sm uppercase tracking-wider px-8 py-3 rounded w-full mt-6 hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? "Placing Order..." : "Place Order"}
          </button>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="border border-gold/50 text-gold font-body text-xs uppercase tracking-wider px-6 py-2.5 rounded w-full mt-3 inline-flex items-center justify-center gap-2 hover:bg-gold/10 transition-colors">
            <MessageCircle size={14} /> Order via WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
}
