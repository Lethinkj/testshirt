# 7F Tshirt E-Commerce

A React-based e-commerce website for selling T-shirts (Polo, Crewneck, Oversized) with Supabase for backend and Stripe for payments. Features include user authentication (admin, manager, user roles), product management, cart, and checkout.

## Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/yourusername/7f-tshirt-shop.git
   cd 7f-tshirt-shop
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file:
   ```
   REACT_APP_SUPABASE_URL=https://ssycjlrhrvyfupvrzpgd.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzeWNqbHJocnZ5ZnVwdnJ6cGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMTI0MDAsImV4cCI6MjA3Mjg4ODQwMH0.jWcYvJlVQkJ2nQDYiRDYRUGkSQUQPSrSxIhEp2OG-do
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Supabase Setup**:
   - Create a Supabase project (ID: `ssycjlrhrvyfupvrzpgd`).
   - Run SQL for `profiles`, `products`, `orders`, `cart_items` tables with RLS (see documentation).
   - Create a `product-images` bucket in Storage.
   - Deploy Edge Function:
     ```bash
     supabase functions deploy create-checkout-session --project-ref ssycjlrhrvyfupvrzpgd
     ```
     Set `STRIPE_SECRET_KEY` in Supabase Dashboard (Functions > Config).

5. **Run Locally**:
   ```bash
   npm start
   ```

## Deployment

1. **Build**:
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

3. **Update Stripe URLs**:
   In `supabase/functions/create-checkout-session/index.ts`, set `success_url` and `cancel_url` to `https://yourusername.github.io/7f-tshirt-shop/cart`.

## Usage

- **Users**: Sign up/login at `/auth`, browse products, add to cart, checkout at `/checkout`.
- **Managers**: Add/edit products (with images) on `/polo`, `/crewneck`, `/oversized`.
- **Admins**: Manage users, products, and orders at `/admin`.

## Dependencies

- React, React Router, Supabase, Stripe, Tailwind CSS
- See `package.json` for full list

## Notes

- Replace `yourusername` with your GitHub username.
- Test Stripe payments with card `4242 4242 4242 4242`.
- Ensure Supabase Auth has email confirmations enabled.