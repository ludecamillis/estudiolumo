import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Bem-vindo ao Prompt Enhancer!
              </CardTitle>
              <CardDescription>Verifique seu email para confirmar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Você se registrou com sucesso! Por favor, verifique sua caixa de entrada e confirme seu email antes de entrar.
              </p>
              <Link href="/auth/login" className="w-full">
                <Button className="w-full">Voltar para Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
