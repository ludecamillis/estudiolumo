import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Checkout } from '@/components/checkout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

export default async function UpgradePage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary">
            Upgrade para PRO
          </h1>
          <p className="text-xl text-muted-foreground">
            Desbloqueie recursos ilimitados e potencialize sua criatividade
          </p>
        </div>

        {/* Plans Comparison */}
        <div className="mb-12 grid gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle>Plano Gratuito</CardTitle>
              <CardDescription>Comece a criar gratuitamente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>3 prompts por mês</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>1 variação por prompt</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Acesso à biblioteca de estilos</span>
                </div>
                <div className="flex items-center gap-2 opacity-40">
                  <span>✕</span>
                  <span>Storyboard ilimitado</span>
                </div>
                <div className="flex items-center gap-2 opacity-40">
                  <span>✕</span>
                  <span>Salvar em nuvem</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>
                Seu plano atual
              </Button>
            </CardContent>
          </Card>

          {/* PRO Plan */}
          <Card className="border-2 border-yellow-500 bg-card shadow-lg shadow-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-yellow-500">Plano PRO</CardTitle>
              <CardDescription>Recursos ilimitados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-yellow-500" />
                  <span>Prompts ilimitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-yellow-500" />
                  <span>Variações ilimitadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-yellow-500" />
                  <span>Storyboard de 6 cenas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-yellow-500" />
                  <span>Salvar na nuvem</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-yellow-500" />
                  <span>Suporte prioritário</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-yellow-500">R$ 37,80</div>
                <p className="text-sm text-muted-foreground">/mês</p>
              </div>
              <Checkout productId="pro-plan" />
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link href="/">
            <Button variant="outline">
              Voltar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
