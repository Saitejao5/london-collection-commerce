import { useParams } from "react-router-dom";
import { products, categories, Category } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ShopPage() {
  const { category } = useParams<{ category?: string }>();
  const validCategory = categories.find((c) => c.name === category);
  const filtered = validCategory
    ? products.filter((p) => p.category === validCategory.name && p.isActive)
    : products.filter((p) => p.isActive);

  return (
    <div className="container py-10">
      {/* Breadcrumb */}
      <div className="text-xs font-body text-muted-foreground mb-6 uppercase tracking-wider">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
        {validCategory && (
          <>
            <span className="mx-2">/</span>
            <span className="text-foreground">{validCategory.name}</span>
          </>
        )}
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl md:text-4xl mb-2"
      >
        {validCategory ? validCategory.name : "All Products"}
      </motion.h1>
      <p className="text-muted-foreground text-sm font-body mb-8">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          to="/shop"
          className={`text-xs font-body uppercase tracking-wider px-4 py-2 rounded-full border transition-colors ${
            !validCategory ? "bg-gold text-primary-foreground border-gold" : "border-border text-muted-foreground hover:border-gold hover:text-gold"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.name}
            to={`/shop/${c.name}`}
            className={`text-xs font-body uppercase tracking-wider px-4 py-2 rounded-full border transition-colors ${
              validCategory?.name === c.name
                ? "bg-gold text-primary-foreground border-gold"
                : "border-border text-muted-foreground hover:border-gold hover:text-gold"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-20 font-body">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
