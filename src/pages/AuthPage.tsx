import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (mode === "signup") {
      if (!form.name.trim()) {
        setError("Full name is required.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(form.email, form.password);
      setLoading(false);
      if (error) {
        setError("Invalid email or password. Please try again.");
        return;
      }
      navigate("/");
    } else {
      const { error } = await signUp(form.email, form.password, form.name, form.phone);
      setLoading(false);
      if (error) {
        if (error.message.includes("already registered")) {
          setError("This email is already registered. Please log in.");
        } else {
          setError(error.message || "Signup failed. Please try again.");
        }
        return;
      }
      setSuccess("Account created! Signing you in…");
      setTimeout(() => navigate("/"), 800);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setSuccess(null);
    setForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary text-primary-foreground p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gold/10" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-gold/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-gold" size={32} />
            <span className="font-display text-2xl tracking-widest uppercase">
              <span className="gold-text">London</span> Collection
            </span>
          </div>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="font-display text-4xl leading-tight">
            Luxury Fashion<br />
            <span className="gold-text">Redefined</span>
          </h2>
          <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
            Explore our curated collection of bangles, necklaces, earrings, watches and handbags — delivered to your door in Kuwait.
          </p>
          <div className="flex gap-6 pt-4">
            {["Bangles", "Watches", "Handbags"].map((cat) => (
              <div key={cat} className="text-center">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center mb-1">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                </div>
                <span className="text-xs text-primary-foreground/60 uppercase tracking-wide">{cat}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs text-primary-foreground/40 tracking-widest uppercase">
          Premium Jewelry · Kuwait Delivery
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <ShoppingBag className="text-gold" size={24} />
            <span className="font-display text-xl tracking-widest uppercase">
              <span className="gold-text">London</span> Collection
            </span>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-lg overflow-hidden border border-border mb-8">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-3 text-sm font-medium uppercase tracking-widest transition-colors duration-200 ${
                  mode === m
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Aisha Al-Salem"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  autoComplete="email"
                />
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9999 9999"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    autoComplete="tel"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              )}

              {/* Error / success messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive"
                  >
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-md bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-600"
                  >
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 uppercase tracking-widest text-sm font-semibold mt-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : mode === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground pt-2">
                {mode === "login" ? (
                  <>
                    New to London Collection?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="text-gold hover:underline font-medium"
                    >
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="text-gold hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </motion.form>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
