
-- 1. Role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: users can read their own roles, admins can read all
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. Products table (replaces static data)
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  category text NOT NULL DEFAULT 'Bangles',
  images text[] NOT NULL DEFAULT '{}',
  stock integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read active products
CREATE POLICY "Authenticated users can view active products"
  ON public.products FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert/update/delete products
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Orders table
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  status text NOT NULL DEFAULT 'PLACED',
  payment_method text NOT NULL DEFAULT 'COD',
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  delivery_area text NOT NULL,
  delivery_block text,
  delivery_street text,
  delivery_house text,
  delivery_notes text,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Order items
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) NOT NULL,
  title text NOT NULL,
  price numeric(10,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  image text
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Users can insert own order items"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Auto-assign 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- 6. Seed products with INR prices
INSERT INTO public.products (title, slug, description, price, currency, category, images, stock, is_featured, is_active) VALUES
('Gold Pattern Bangles Set', 'gold-pattern-bangles-set', 'Premium 18K gold plated bangles set with intricate floral patterns. Perfect for weddings and special occasions.', 2499, 'INR', 'Bangles', ARRAY['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop','https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop'], 25, true, true),
('Crystal Drop Necklace', 'crystal-drop-necklace', 'Elegant crystal drop necklace with adjustable chain. Stunning centerpiece for any outfit.', 3499, 'INR', 'Necklaces', ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop'], 18, true, true),
('Pearl Stud Earrings', 'pearl-stud-earrings', 'Classic pearl stud earrings with gold-plated setting. Timeless elegance for everyday wear.', 1499, 'INR', 'Earrings', ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'], 40, true, true),
('Rose Gold Watch', 'rose-gold-watch', 'Minimalist rose gold watch with mesh bracelet. Water-resistant and scratch-proof crystal.', 5999, 'INR', 'Watches', ARRAY['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop'], 12, true, true),
('Quilted Leather Handbag', 'quilted-leather-handbag', 'Luxurious quilted leather handbag with gold chain strap. Spacious interior with multiple compartments.', 8999, 'INR', 'Handbags', ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop'], 8, true, true),
('Diamond Cut Bangles', 'diamond-cut-bangles', 'Set of 6 diamond-cut gold bangles with rhodium finish for extra shine.', 3999, 'INR', 'Bangles', ARRAY['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop'], 15, false, true),
('Layered Chain Necklace', 'layered-chain-necklace', 'Trendy multi-layered gold chain necklace with pendant charms.', 2799, 'INR', 'Necklaces', ARRAY['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop'], 22, false, true),
('Hoop Earrings Gold', 'hoop-earrings-gold', 'Classic gold hoop earrings, lightweight and comfortable for all-day wear.', 999, 'INR', 'Earrings', ARRAY['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&h=600&fit=crop'], 50, false, true),
('Classic Silver Watch', 'classic-silver-watch', 'Timeless silver-tone analog watch with date display.', 4999, 'INR', 'Watches', ARRAY['https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&h=600&fit=crop'], 10, false, true),
('Mini Crossbody Bag', 'mini-crossbody-bag', 'Compact crossbody bag in faux leather with adjustable strap.', 5499, 'INR', 'Handbags', ARRAY['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop'], 14, false, true),
('Twisted Gold Bangle', 'twisted-gold-bangle', 'Elegant twisted design gold bangle, stackable with other bangles.', 1999, 'INR', 'Bangles', ARRAY['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop'], 30, false, true),
('Statement Choker', 'statement-choker', 'Bold statement choker necklace with crystal embellishments.', 4499, 'INR', 'Necklaces', ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop'], 0, false, true);

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
