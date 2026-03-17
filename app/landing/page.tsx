'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Camera, Lightbulb, Users, Check, ArrowRight } from 'lucide-react'
import { createCheckoutSession } from '@/app/actions/stripe'
import { useState } from 'react'

export default function LandingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleCheckout = async (planId: string) => {
    setLoadingPlan(planId)
    try {
      await createCheckoutSession(planId)
    } catch (error) {
      console.error('Checkout error:', error)
      setLoadingPlan(null)
    }
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Lumo</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Começar grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-secondary/10 px-6 py-20 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
            <Sparkles className="mr-2 h-4 w-4" />
            Bem-vindo ao Lumo Prompt Enhancer
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight text-foreground mb-6">
            Crie prompts perfeitos para qualquer desenho com qualidade cinematográfica
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-balance">
            Controle câmera, iluminação, plano e consistência como um diretor de cinema
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Começar grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Saiba mais
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-foreground">
            Por que Lumo?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Dificuldade em criar prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Criar prompts estruturados para IA é complexo e leva muito tempo
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Resultados inconsistentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sem controle adequado de câmera e iluminação, os resultados ficam desconexos
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Personagens mudando</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Falta de consistência visual faz personagens parecerem diferentes
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="px-6 py-20 sm:py-28 bg-primary/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 text-foreground">
            Você não escreve prompts.
            <br />
            <span className="text-primary">Você controla a cena.</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Com Lumo, você tem o controle cinematográfico total sobre cada aspecto do prompt
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-foreground">
            Como funciona
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Descreva a cena",
                description: "Defina o personagem, ação, ambiente e estilo do seu desenho"
              },
              {
                step: "2",
                title: "Escolha configurações visuais",
                description: "Controle câmera, iluminação, plano e movimento como um diretor"
              },
              {
                step: "3",
                title: "Gere prompt profissional",
                description: "Receba um prompt estruturado e cinematic pronto para IA"
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary text-lg">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 sm:py-28 bg-card/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-foreground">
            Recursos cinematográficos
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Camera,
                title: "Controle de câmera",
                description: "10 tipos de movimentos de câmera: orbit, tracking, push in, pull out, pan, tilt e mais"
              },
              {
                icon: Lightbulb,
                title: "Plano cinematográfico",
                description: "7 opções de planos: aberto, médio, americano, close-up, extreme close-up, over the shoulder"
              },
              {
                icon: Sparkles,
                title: "Iluminação profissional",
                description: "Múltiplos estilos de iluminação para criar a atmosfera perfeita"
              },
              {
                icon: Users,
                title: "Consistência de personagem",
                description: "Garanta que seu personagem mantenha identidade, rosto, cabelo e proporções"
              }
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card key={idx} className="border-border/50 bg-background">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-foreground">
            Planos para todos
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                id: 'free',
                name: "Gratuito",
                price: "R$ 0",
                description: "Perfeito para começar",
                features: ["5 prompts por mês", "Acesso básico aos geradores", "Biblioteca limitada de estilos"]
              },
              {
                id: 'pro',
                name: "Lumo Studio Pro Prompts",
                price: "R$ 49,10",
                period: "/mês",
                description: "Para criadores profissionais",
                features: ["Prompts mensais", "Acesso completo a todos os geradores", "Biblioteca completa de estilos", "Exports em alta qualidade", "Suporte por email"],
                highlighted: true
              },
              {
                id: 'studio',
                name: "Lumo Studio Prompt",
                price: "R$ 98,10",
                period: "/mês",
                description: "Para estúdios e agências",
                features: ["Prompts mensais", "Acesso total a todas as features", "Gerenciamento de equipe", "Análises e relatórios", "Suporte prioritário 24/7"]
              }
            ].map((plan) => (
              <Card 
                key={plan.id} 
                className={`border-2 flex flex-col ${plan.highlighted ? 'border-primary bg-primary/5' : 'border-border/50 bg-card/50'}`}
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-foreground">
                      {plan.price}
                      {plan.period && <span className="text-lg text-muted-foreground">{plan.period}</span>}
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    onClick={() => handleCheckout(plan.id)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? 'Processando...' : 'Começar agora'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 py-20 sm:py-28 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-t border-border/50">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
            Pronto para criar prompts cinematográficos?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-balance">
            Comece gratuitamente agora. Sem cartão de crédito necessário.
          </p>
          
          <Link href="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Começar grátis agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 px-6 py-12">
        <div className="mx-auto max-w-4xl text-center text-sm text-muted-foreground">
          <p>
            © 2024 Lumo. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
