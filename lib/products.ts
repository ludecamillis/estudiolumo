export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  stripePriceId?: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'free',
    name: 'Gratuito',
    description: 'Perfeito para começar',
    priceInCents: 0,
  },
  {
    id: 'pro',
    name: 'Lumo Studio Pro Prompts',
    description: 'Para criadores profissionais',
    priceInCents: 4910, // R$ 49,10/mês
    stripePriceId: 'price_1TBpA8DSdhbC1y9wlMQEEQhJ',
  },
  {
    id: 'studio',
    name: 'Lumo Studio Prompt',
    description: 'Para estúdios e agências',
    priceInCents: 9810, // R$ 98,10/mês
    stripePriceId: 'price_1TBpb7DSdhbC1y9wubOgigIU',
  },
]

export function getProduct(productId: string): Product | undefined {
  return PRODUCTS.find(p => p.id === productId)
}
