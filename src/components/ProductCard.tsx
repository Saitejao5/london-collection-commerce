import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { formatPrice } from "@/lib/formatPrice";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const isWished = has(product.id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem({ productId: product.id, title: product.title, price: product.price, image: product.images[0] });
    toast.success(`${product.title} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded bg-card aspect-square">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {outOfStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-sm font-body uppercase tracking-wider text-foreground">Sold Out</span>
            </div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toggle(product.id); }}
            className={`absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-colors ${isWished ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}
            aria-label="Toggle wishlist"
          >
            <Heart size={16} fill={isWished ? "currentColor" : "none"} />
          </button>
          {!outOfStock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-0 left-0 right-0 bg-secondary/90 backdrop-blur-sm text-secondary-foreground text-xs uppercase tracking-wider py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-center"
            >
              Add to Cart
            </button>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-body text-sm text-foreground group-hover:text-gold transition-colors truncate">{product.title}</h3>
          <p className="font-display text-base text-gold">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
