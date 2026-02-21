import { useProducts } from "@/hooks/useProducts";
import { useWishlistStore } from "@/store/wishlistStore";
import ProductCard from "@/components/ProductCard";
import { Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { ids } = useWishlistStore();
  const { data: allProducts = [], isLoading } = useProducts();
  const wishlistProducts = allProducts.filter((p) => ids.includes(p.id));

  if (isLoading) {
    return <div className="container py-20 flex justify-center"><Loader2 className="animate-spin text-gold" size={32} /></div>;
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="container py-20 text-center">
        <Heart className="mx-auto mb-4 text-muted-foreground" size={48} />
        <h1 className="font-display text-2xl mb-2">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground text-sm font-body mb-6">Save items you love for later.</p>
        <Link to="/shop" className="gold-gradient text-primary-foreground font-body text-sm uppercase tracking-wider px-8 py-3 rounded inline-block">Explore Shop</Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl mb-8">My Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlistProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
