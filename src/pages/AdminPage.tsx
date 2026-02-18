import { products } from "@/data/products";
import { Package, DollarSign, AlertTriangle, ShoppingCart, Eye, Edit, ToggleLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const mockOrders = [
  { id: "LC-10023", customer: "Aisha K.", total: 7.0, status: "PLACED", payment: "COD", date: "2026-02-18" },
  { id: "LC-10024", customer: "Fatima M.", total: 12.5, status: "CONFIRMED", payment: "ONLINE", date: "2026-02-17" },
  { id: "LC-10025", customer: "Noura A.", total: 3.0, status: "SHIPPED", payment: "COD", date: "2026-02-16" },
  { id: "LC-10026", customer: "Sara H.", total: 15.0, status: "DELIVERED", payment: "ONLINE", date: "2026-02-15" },
];

export default function AdminPage() {
  const [tab, setTab] = useState<"dashboard" | "products" | "orders">("dashboard");
  const todayOrders = mockOrders.filter((o) => o.date === "2026-02-18").length;
  const totalRevenue = mockOrders.reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 5 && p.stock > 0);
  const outOfStock = products.filter((p) => p.stock === 0);

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

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-border">
        {(["dashboard", "products", "orders"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-body uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              tab === t ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ShoppingCart, label: "Today Orders", value: todayOrders },
              { icon: DollarSign, label: "Total Revenue", value: `${totalRevenue.toFixed(3)} KWD` },
              { icon: AlertTriangle, label: "Low Stock", value: lowStock.length },
              { icon: Package, label: "Out of Stock", value: outOfStock.length },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded p-5">
                <stat.icon className="text-gold mb-2" size={20} />
                <p className="font-display text-xl">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-body">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Low stock alerts */}
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
                    <td className="px-4 py-3 text-right">{p.price.toFixed(3)} KWD</td>
                    <td className={`px-4 py-3 text-right ${p.stock <= 5 ? "text-destructive font-medium" : ""}`}>{p.stock}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${p.isActive ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="bg-card rounded overflow-hidden">
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
                {mockOrders.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{o.id}</td>
                    <td className="px-4 py-3">{o.customer}</td>
                    <td className="px-4 py-3 text-right">{o.total.toFixed(3)} KWD</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs px-2 py-1 rounded bg-muted">{o.payment}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${statusColor[o.status] || ""}`}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
