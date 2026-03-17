'use server'

import { redirect } from 'next/navigation'
import { stripe } from '../../lib/stripe'
import { PRODUCTS } from '../../lib/products'
import { createClient } from '@supabase/supabase-js'

export async function createCheckoutSession(productId: string) {
  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  // Free plan doesn't need checkout
  if (product.id === 'free') {
    // Update user plan in database to 'free'
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('[v0] Supabase not configured')
      redirect('/app')
      return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: { user } } = await supabase.auth.admin.getUserById(
      process.env.NEXT_PUBLIC_USER_ID || ''
    ).catch(() => ({ data: { user: null } }))
    
    redirect('/app')
  }

  // Validate that stripePriceId exists for paid plans
  if (!product.stripePriceId) {
    throw new Error(`Stripe price ID not configured for product "${productId}"`)
  }

  // Create Checkout Session for paid plans
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'hosted',
    mode: 'subscription',
    line_items: [
      {
        price: product.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/app?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/`,
    customer_email: undefined,
  })

  if (!session.url) {
    throw new Error('Failed to create checkout session')
  }

  // Redirect to Stripe checkout
  redirect(session.url)
}
