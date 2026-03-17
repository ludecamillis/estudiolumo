'use client'

import { useCallback, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'

import { createCheckoutSession } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export function Checkout({ productId }: { productId: string }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleStartCheckout = useCallback(async () => {
    try {
      setIsLoading(true)
      const secret = await createCheckoutSession(productId)
      setClientSecret(secret)
    } catch (error) {
      console.error('Error starting checkout:', error)
      alert('Erro ao iniciar pagamento. Tente novamente.')
      setIsLoading(false)
    }
  }, [productId])

  if (clientSecret) {
    return (
      <div id="checkout" className="w-full">
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    )
  }

  return (
    <Button
      onClick={handleStartCheckout}
      disabled={isLoading}
      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
    >
      {isLoading ? 'Carregando...' : 'Faça Upgrade Agora'}
    </Button>
  )
}
