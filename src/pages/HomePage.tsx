import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useFeaturedProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";

const WHATSAPP_NUMBER = "919985542871";

const categories = [
  { name: "Bangles", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop" },
  { name: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop" },
  { name: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop" },
  { name: "Watches", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop" },
  { name: "Handbags", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop" },
];

export default function HomePage() {
  const { data: featured = [] } = useFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-secondary">
        <img src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1920&h=1080&fit=crop" alt="Luxury jewelry" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl">
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4 font-body">New Collection 2026</p>
            <h1 className="font-display text-4xl md:text-6xl text-secondary-foreground leading-tight mb-6">
              Affordable <span className="gold-text">Luxury</span> for Every Occasion
            </h1>
            <p className="text-secondary-foreground/70 font-body text-sm md:text-base mb-8 leading-relaxed">
              Discover curated jewelry, watches & handbags. Free delivery on orders above ₹999.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="gold-gradient text-primary-foreground font-body text-sm uppercase tracking-wider px-8 py-3 rounded inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
                Shop Now <ArrowRight size={16} />
              </Link>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello London Collection! I'd like to know more about your products.")}`} target="_blank" rel="noopener noreferrer" className="border border-gold/50 text-gold font-body text-sm uppercase tracking-wider px-8 py-3 rounded inline-flex items-center gap-2 hover:bg-gold/10 transition-colors">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl mb-2">Shop by Category</h2>
          <p className="text-muted-foreground text-sm font-body">Find what speaks to you</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link to={`/shop/${cat.name}`} className="group block relative rounded overflow-hidden aspect-[3/4]">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="font-display text-lg text-secondary-foreground">{cat.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-card py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-2xl md:text-3xl">Featured Pieces</h2>
              <p className="text-muted-foreground text-sm font-body mt-1">Handpicked for you</p>
            </div>
            <Link to="/shop" className="text-gold text-sm font-body uppercase tracking-wider hover:underline inline-flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="container py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-secondary rounded-lg p-10 md:p-16">
          <MessageCircle className="mx-auto mb-4 text-gold" size={40} />
          <h2 className="font-display text-2xl md:text-3xl text-secondary-foreground mb-3">Prefer to Order via WhatsApp?</h2>
          <p className="text-muted-foreground text-sm font-body max-w-md mx-auto mb-6">Send us a message and our team will help you place your order instantly.</p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello London Collection!")}`} target="_blank" rel="noopener noreferrer" className="gold-gradient text-primary-foreground font-body text-sm uppercase tracking-wider px-8 py-3 rounded inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
            <MessageCircle size={16} /> Chat Now
          </a>
        </motion.div>
      </section>
    </div>
  );
}
