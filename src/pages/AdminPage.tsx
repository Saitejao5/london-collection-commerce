import { useAllProducts, Product } from "@/hooks/useProducts";
import { useIsAdmin } from "@/hooks/useRole";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Package, DollarSign, AlertTriangle, ShoppingCart, Plus, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { formatPrice } from "@/lib/formatPrice";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = ["Bangles", "Necklaces", "Earrings", "Watches", "Handbags", "Rings"];

const emptyProduct = {
  title: "", slug: "", description: "", price: 0, category: "Bangles",
  images: [""], stock: 0, is_featured: false, is_active: true,
};

export default function AdminPage() {
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin();
  const { data: products = [], isLoading } = useAllProducts();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"dashboard" | "products" | "orders" | "add">("dashboard");
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  if (roleLoading || isLoading) {
    return <div className="container py-20 flex justify-center"><Loader2 className="animate-spin text-gold" size={32} /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-2xl mb-2">Access Denied</h1>
        <p className="text-muted-foreground font-body text-sm">You don't have admin privileges.</p>
        <Link to="/" className="text-gold text-sm mt-4 inline-block hover:underline">← Back to Store</Link>
      </div>
    );
  }

  const lowStock = products.filter((p) => p.stock <= 5 && p.stock > 0);
  const outOfStock = products.filter((p) => p.stock === 0);

  const loadOrders = async () => {
    setOrdersLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
    setOrdersLoading(false);
  };

  const handleTabChange = (t: typeof tab) => {
    setTab(t);
    if (t === "orders") loadOrders();
  };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const slug = form.slug || generateSlug(form.title);
    const images = form.images.filter((img) => img.trim());
    const { error } = await supabase.from("products").insert({
      title: form.title.trim(),
      slug,
      description: form.description.trim(),
      price: form.price,
      currency: "INR",
      category: form.category,
      images: images.length ? images : ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop"],
      stock: form.stock,
      is_featured: form.is_featured,
      is_active: form.is_active,
      created_by: user?.id,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Product added!");
      setForm(emptyProduct);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setTab("products");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); queryClient.invalidateQueries({ queryKey: ["products"] }); }
  };

  const toggleActive = async (p: Product) => {
    const { error } = await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    if (error) toast.error(error.message);
    else queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const statusColor: Record<string, string> = {
    PLACED: "bg-accent text-accent-foreground",
    CONFIRMED: "bg-gold/20 text-gold-dark",
    SHIPPED: "bg-primary/10 text-primary",
    DELIVERED: "bg-green-100 text-green-800",
  };

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Admin Dashboard</h1>
        <Link to="/" className="text-sm text-muted-foreground font-body hover:text-gold transition-colors">← Back to Store</Link>
      </div>

      <div className="flex gap-1 mb-8 border-b border-border">
        {(["dashboard", "products", "add", "orders"] as const).map((t) => (
          <button key={t} onClick={() => handleTabChange(t)} className={`px-4 py-2 text-sm font-body uppercase tracking-wider transition-colors border-b-2 -mb-px ${tab === t ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t === "add" ? "Add Product" : t}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Package, label: "Total Products", value: products.length },
              { icon: DollarSign, label: "Active Products", value: products.filter(p => p.is_active).length },
              { icon: AlertTriangle, label: "Low Stock", value: lowStock.length },
              { icon: ShoppingCart, label: "Out of Stock", value: outOfStock.length },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded p-5">
                <stat.icon className="text-gold mb-2" size={20} />
                <p className="font-display text-xl">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-body">{stat.label}</p>
              </motion.div>
            ))}
          </div>
          {lowStock.length > 0 && (
            <div className="bg-card rounded p-6">
              <h2 className="font-display text-lg mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-gold" /> Low Stock Alert</h2>
              <div className="space-y-2">
                {lowStock.map((p) => (
                  <div key={p.id} className="flex justify-between text-sm font-body py-2 border-b border-border last:border-0">
                    <span>{p.title}</span>
                    <span className="text-destructive font-medium">{p.stock} left</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "products" && (
        <div className="bg-card rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-right px-4 py-3">Price</th>
                  <th className="text-right px-4 py-3">Stock</th>
                  <th className="text-center px-4 py-3">Status</th>
                  <th className="text-center px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover" />
                      <span className="truncate max-w-[200px]">{p.title}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3 text-right">{formatPrice(p.price)}</td>
                    <td className={`px-4 py-3 text-right ${p.stock <= 5 ? "text-destructive font-medium" : ""}`}>{p.stock}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleActive(p)} className={`text-xs px-2 py-1 rounded ${p.is_active ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                        {p.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "add" && (
        <form onSubmit={handleAddProduct} className="bg-card rounded p-6 max-w-2xl space-y-4">
          <h2 className="font-display text-lg mb-2">Add New Product</h2>
          <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }))} placeholder="Product Title *" required maxLength={200} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring" />
          <input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="Slug (auto-generated)" maxLength={200} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring" />
          <textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" maxLength={2000} rows={3} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring" />
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground font-body mb-1 block">Price (₹)</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-body mb-1 block">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-body mb-1 block">Category</label>
              <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-body mb-1 block">Image URLs (one per line)</label>
            <textarea value={form.images.join("\n")} onChange={(e) => setForm(f => ({ ...f, images: e.target.value.split("\n") }))} placeholder="https://example.com/image.jpg" rows={3} className="w-full bg-background border border-input rounded px-4 py-3 text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm font-body cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="accent-gold" /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-body cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))} className="accent-gold" /> Active
            </label>
          </div>
          <button type="submit" disabled={saving} className="gold-gradient text-primary-foreground font-body text-sm uppercase tracking-wider px-8 py-3 rounded inline-flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
            <Plus size={16} /> {saving ? "Adding..." : "Add Product"}
          </button>
        </form>
      )}

      {tab === "orders" && (
        <div className="bg-card rounded overflow-hidden">
          {ordersLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gold" size={24} /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3">Order</th>
                    <th className="text-left px-4 py-3">Customer</th>
                    <th className="text-right px-4 py-3">Total</th>
                    <th className="text-center px-4 py-3">Payment</th>
                    <th className="text-center px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No orders yet.</td></tr>
                  )}
                  {orders.map((o: any) => (
                    <tr key={o.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{o.order_number}</td>
                      <td className="px-4 py-3">{o.customer_name}</td>
                      <td className="px-4 py-3 text-right">{formatPrice(o.total)}</td>
                      <td className="px-4 py-3 text-center"><span className="text-xs px-2 py-1 rounded bg-muted">{o.payment_method}</span></td>
                      <td className="px-4 py-3 text-center"><span className={`text-xs px-2 py-1 rounded ${statusColor[o.status] || ""}`}>{o.status}</span></td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
