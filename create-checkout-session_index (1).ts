import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    // Note: Order creation moved to client-side in Cart.js for simplicity
    return new Response(JSON.stringify({ message: 'Stripe functionality removed.' }), {
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