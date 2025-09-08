import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.5.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY'), { httpClient: Stripe.createFetchHttpClient() });
const supabase = createClient(
  'https://ssycjlrhrvyfupvrzpgd.supabase.co',
  Deno.env.get('SUPABASE_ANON_KEY')
);

serve(async (req) => {
  try {
    const { cartItems, total, shipping } = await req.json();
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const { data: { user } } = await supabase.auth.getUser(authHeader.split('Bearer ')[1]);
    if (!user) throw new Error('User not authenticated');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: { name: item.products.name },
          unit_amount: Math.round(item.products.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'https://yourusername.github.io/7f-tshirt-shop/cart?success=true',
      cancel_url: 'https://yourusername.github.io/7f-tshirt-shop/cart?canceled=true',
      metadata: { userId: user.id, shipping: JSON.stringify(shipping) },
    });

    // Note: Order creation moved to client-side in Cart.js for simplicity
    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});