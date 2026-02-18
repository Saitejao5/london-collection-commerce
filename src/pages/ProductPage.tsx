import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductBySlug } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Heart, Minus, Plus, ShoppingBag, MessageCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "919985542871";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || "");
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground font-body">Product not found.</p>
        <Link to="/shop" className="text-gold text-sm mt-4 inline-block hover:underline">Back to shop</Link>
      </div>
    );
  }

  const isWished = has(product.id);
  const outOfStock = product.stock === 0;

  const handleAdd = () => {
    addItem({ productId: product.id, title: product.title, price: product.price, image: product.images[0] }, qty);
    toast.success(`${product.title} added to cart`);
  };

  const waMsg = encodeURIComponent(
    `Hello London Collection,\nI want to order:\n\nProduct: ${product.title}\nQuantity: ${qty}\nTotal: ${(product.price * qty).toFixed(3)} KWD\n\nName:\nAddress:\nPhone:`
  );

  return (
    <div className="container py-10">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold mb-6 font-body">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
        {/* Images */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="aspect-square rounded overflow-hidden bg-card mb-3">
            <img src={product.images[selectedImg]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                    i === selectedImg ? "border-gold" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-xs font-body uppercase tracking-wider text-gold mb-2">{product.category}</p>
          <h1 className="font-display text-2xl md:text-3xl mb-2">{product.title}</h1>
          <p className="font-display text-xl text-gold mb-4">{product.price.toFixed(3)} KWD</p>
          <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">{product.description}</p>

          {outOfStock ? (
            <p className="text-destructive text-sm font-body uppercase tracking-wider">Out of Stock</p>
          ) : (
            <>
              <p className="text-xs text-muted-foreground font-body mb-1">{product.stock} in stock</p>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-border rounded">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="px-3 py-2 font-body text-sm min-w-[2.5rem] text-center">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAdd}
                  className="gold-gradient text-primary-foreground font-body text-sm uppercase tracking-wider px-8 py-3 rounded inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity flex-1"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gold/50 text-gold font-body text-sm uppercase tracking-wider px-8 py-3 rounded inline-flex items-center justify-center gap-2 hover:bg-gold/10 transition-colors flex-1"
                >
                  <MessageCircle size={16} /> Order on WhatsApp
                </a>
              </div>
            </>
          )}

          <button
            onClick={() => toggle(product.id)}
            className={`mt-4 inline-flex items-center gap-2 text-sm font-body transition-colors ${
              isWished ? "text-destructive" : "text-muted-foreground hover:text-destructive"
            }`}
          >
            <Heart size={16} fill={isWished ? "currentColor" : "none"} />
            {isWished ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
