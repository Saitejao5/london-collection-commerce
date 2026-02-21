import { useParams } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const categoryNames = ["Bangles", "Necklaces", "Earrings", "Watches", "Handbags", "Rings"];

export default function ShopPage() {
  const { category } = useParams<{ category?: string }>();
  const validCategory = categoryNames.includes(category || "") ? category : undefined;
  const { data: products = [], isLoading } = useProducts(validCategory);

  return (
    <div className="container py-10">
      <div className="text-xs font-body text-muted-foreground mb-6 uppercase tracking-wider">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
        {validCategory && (
          <>
            <span className="mx-2">/</span>
            <span className="text-foreground">{validCategory}</span>
          </>
        )}
      </div>

      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl md:text-4xl mb-2">
        {validCategory || "All Products"}
      </motion.h1>
      <p className="text-muted-foreground text-sm font-body mb-8">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link to="/shop" className={`text-xs font-body uppercase tracking-wider px-4 py-2 rounded-full border transition-colors ${!validCategory ? "bg-gold text-primary-foreground border-gold" : "border-border text-muted-foreground hover:border-gold hover:text-gold"}`}>All</Link>
        {categoryNames.map((c) => (
          <Link key={c} to={`/shop/${c}`} className={`text-xs font-body uppercase tracking-wider px-4 py-2 rounded-full border transition-colors ${validCategory === c ? "bg-gold text-primary-foreground border-gold" : "border-border text-muted-foreground hover:border-gold hover:text-gold"}`}>{c}</Link>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" size={32} /></div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground py-20 font-body">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
