export type Category = "Bangles" | "Necklaces" | "Earrings" | "Watches" | "Handbags";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  category: Category;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
}

export const categories: { name: Category; image: string; count: number }[] = [
  { name: "Bangles", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop", count: 24 },
  { name: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop", count: 18 },
  { name: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop", count: 32 },
  { name: "Watches", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop", count: 15 },
  { name: "Handbags", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop", count: 20 },
];

export const products: Product[] = [
  {
    id: "1", title: "Gold Pattern Bangles Set", slug: "gold-pattern-bangles-set",
    description: "Premium 18K gold plated bangles set with intricate floral patterns. Perfect for weddings and special occasions.",
    price: 3.0, currency: "KWD", category: "Bangles",
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop"],
    stock: 25, isFeatured: true, isActive: true,
  },
  {
    id: "2", title: "Crystal Drop Necklace", slug: "crystal-drop-necklace",
    description: "Elegant crystal drop necklace with adjustable chain. Stunning centerpiece for any outfit.",
    price: 4.5, currency: "KWD", category: "Necklaces",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop"],
    stock: 18, isFeatured: true, isActive: true,
  },
  {
    id: "3", title: "Pearl Stud Earrings", slug: "pearl-stud-earrings",
    description: "Classic pearl stud earrings with gold-plated setting. Timeless elegance for everyday wear.",
    price: 2.0, currency: "KWD", category: "Earrings",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop"],
    stock: 40, isFeatured: true, isActive: true,
  },
  {
    id: "4", title: "Rose Gold Watch", slug: "rose-gold-watch",
    description: "Minimalist rose gold watch with mesh bracelet. Water-resistant and scratch-proof crystal.",
    price: 8.0, currency: "KWD", category: "Watches",
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop"],
    stock: 12, isFeatured: true, isActive: true,
  },
  {
    id: "5", title: "Quilted Leather Handbag", slug: "quilted-leather-handbag",
    description: "Luxurious quilted leather handbag with gold chain strap. Spacious interior with multiple compartments.",
    price: 12.0, currency: "KWD", category: "Handbags",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop"],
    stock: 8, isFeatured: true, isActive: true,
  },
  {
    id: "6", title: "Diamond Cut Bangles", slug: "diamond-cut-bangles",
    description: "Set of 6 diamond-cut gold bangles with rhodium finish for extra shine.",
    price: 5.0, currency: "KWD", category: "Bangles",
    images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop"],
    stock: 15, isFeatured: false, isActive: true,
  },
  {
    id: "7", title: "Layered Chain Necklace", slug: "layered-chain-necklace",
    description: "Trendy multi-layered gold chain necklace with pendant charms.",
    price: 3.5, currency: "KWD", category: "Necklaces",
    images: ["https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop"],
    stock: 22, isFeatured: false, isActive: true,
  },
  {
    id: "8", title: "Hoop Earrings Gold", slug: "hoop-earrings-gold",
    description: "Classic gold hoop earrings, lightweight and comfortable for all-day wear.",
    price: 1.5, currency: "KWD", category: "Earrings",
    images: ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&h=600&fit=crop"],
    stock: 50, isFeatured: false, isActive: true,
  },
  {
    id: "9", title: "Classic Silver Watch", slug: "classic-silver-watch",
    description: "Timeless silver-tone analog watch with date display.",
    price: 6.5, currency: "KWD", category: "Watches",
    images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop"],
    stock: 10, isFeatured: false, isActive: true,
  },
  {
    id: "10", title: "Mini Crossbody Bag", slug: "mini-crossbody-bag",
    description: "Compact crossbody bag in faux leather with adjustable strap.",
    price: 7.0, currency: "KWD", category: "Handbags",
    images: ["https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop"],
    stock: 14, isFeatured: false, isActive: true,
  },
  {
    id: "11", title: "Twisted Gold Bangle", slug: "twisted-gold-bangle",
    description: "Elegant twisted design gold bangle, stackable with other bangles.",
    price: 2.5, currency: "KWD", category: "Bangles",
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop"],
    stock: 30, isFeatured: false, isActive: true,
  },
  {
    id: "12", title: "Statement Choker", slug: "statement-choker",
    description: "Bold statement choker necklace with crystal embellishments.",
    price: 5.5, currency: "KWD", category: "Necklaces",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop"],
    stock: 0, isFeatured: false, isActive: true,
  },
];

export const getProductBySlug = (slug: string) => products.find(p => p.slug === slug);
export const getProductsByCategory = (cat: Category) => products.filter(p => p.category === cat && p.isActive);
export const getFeaturedProducts = () => products.filter(p => p.isFeatured && p.isActive);
