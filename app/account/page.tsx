'use client'

import { useState } from 'react'
import { redirect } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Mail, User, Calendar, CreditCard } from 'lucide-react'

export default function AccountPage() {
  const { user, profile, loading, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-12 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!user) {
    redirect('/auth/login')
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      redirect('/')
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-6">
              ← Voltar
            </Button>
          </Link>
          <h1 className="mb-2 text-4xl font-bold text-primary">Minha Conta</h1>
          <p className="text-muted-foreground">Gerencie suas configurações e perfil</p>
        </div>

        {/* Profile Information */}
        <Card className="mb-6 border-border bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações de Perfil
            </CardTitle>
            <CardDescription>Suas informações pessoais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{user.email}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Data de Criação</label>
              <div className="flex items-center gap-2 rounded-lg bg-secondary p-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('pt-BR')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Information */}
        <Card className="mb-6 border-border bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Plano Atual
            </CardTitle>
            <CardDescription>Informações do seu plano de assinatura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
              <div>
                <p className="font-semibold text-foreground">
                  {profile?.plan === 'pro' ? 'Plano PRO' : 'Plano Gratuito'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile?.plan === 'pro'
                    ? 'Você tem acesso a todos os recursos premium'
                    : 'Você tem 3 prompts gratuitos por mês'}
                </p>
              </div>
              {profile?.plan === 'free' && (
                <Link href="/upgrade">
                  <Button className="bg-[#F2A900] text-black hover:bg-[#F2A900]/90">
                    Upgrade
                  </Button>
                </Link>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Prompts Usados este Mês</label>
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-foreground">
                  {profile?.prompts_used_this_month || 0} / {profile?.plan === 'pro' ? '∞' : '3'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-500/50 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-500">Zona de Perigo</CardTitle>
            <CardDescription>Ações que não podem ser desfeitas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full"
            >
              {isSigningOut ? 'Saindo...' : 'Sair da Conta'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
