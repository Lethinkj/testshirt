import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.5.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = Stripe(Deno.env.get('STRIPE_SECRET_KEY'), { httpClient: Stripe.createFetchHttpClient() });
const supabase = createClient(
  'https://ssycjlrhrvyfupvrzpgd.supabase.co',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') // Use service role key for server-side operations
);

// Webhook signature verification
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  
  // Handle webhook events (e.g., payment success)
  if (req.method === 'POST' && signature) {
    try {
      const body = await req.text();
      const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const shipping = JSON.parse(session.metadata.shipping || '{}');
        const cartItems = JSON.parse(session.metadata.cartItems || '[]');

        // Save orders
        for (const item of cartItems) {
          await supabase.from('orders').insert({
            user_id: userId,
            product_id: item.product_id,
            quantity: item.quantity,
            total_price: item.quantity * item.products.price,
            status: 'paid',
            shipping_details: shipping,
          });
        }

        // Clear cart
        await supabase.from('cart_items').delete().eq('user_id', userId);

        return new Response(JSON.stringify({ received: true }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        });
      }

      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }
  }

  // Handle checkout session creation
  if (req.method === 'POST') {
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
        metadata: {
          userId: user.id,
          shipping: JSON.stringify(shipping),
          cartItems: JSON.stringify(cartItems),
        },
      });

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
  }

  return new Response('Method not allowed', { status: 405 });
});