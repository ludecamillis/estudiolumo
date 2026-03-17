import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.metadata?.userId) {
          // Update user profile to PRO
          const { error } = await supabase
            .from('profiles')
            .update({
              plan: 'pro',
              prompts_used_this_month: 0,
            })
            .eq('id', session.metadata.userId)

          if (error) {
            console.error('Error updating profile:', error)
          } else {
            console.log(`User ${session.metadata.userId} upgraded to PRO`)
          }
        }
        break

      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription
        
        if (subscription.metadata?.userId) {
          // Downgrade user to FREE
          const { error } = await supabase
            .from('profiles')
            .update({
              plan: 'free',
              prompts_used_this_month: 0,
            })
            .eq('id', subscription.metadata.userId)

          if (error) {
            console.error('Error downgrading profile:', error)
          } else {
            console.log(`User ${subscription.metadata.userId} downgraded to FREE`)
          }
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
