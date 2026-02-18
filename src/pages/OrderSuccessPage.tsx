import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const orderNum = params.get("order") || "LC-00000";

  return (
    <div className="container py-20 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
        <CheckCircle className="mx-auto mb-6 text-gold" size={64} />
      </motion.div>
      <h1 className="font-display text-3xl mb-2">Order Confirmed!</h1>
      <p className="text-muted-foreground font-body text-sm mb-1">Thank you for your order.</p>
      <p className="font-display text-lg text-gold mb-8">Order #{orderNum}</p>
      <p className="text-muted-foreground font-body text-sm max-w-md mx-auto mb-8">
        We'll send you a WhatsApp message with tracking details soon. You can also check your order status anytime.
      </p>
      <Link to="/shop" className="gold-gradient text-primary-foreground font-body text-sm uppercase tracking-wider px-8 py-3 rounded inline-block hover:opacity-90 transition-opacity">
        Continue Shopping
      </Link>
    </div>
  );
}
