'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Check } from 'lucide-react'

const SQL_SETUP = `-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  plan text default 'free' check (plan in ('free', 'pro')),
  prompts_used_this_month integer default 0,
  month_reset_date timestamp with time zone default now(),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Create saved_prompts table
create table if not exists public.saved_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  prompt_en text not null,
  prompt_pt text,
  style text,
  character text,
  action text,
  setting text,
  lighting text,
  composition text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.saved_prompts enable row level security;

create policy "prompts_select_own" on public.saved_prompts for select using (auth.uid() = user_id);
create policy "prompts_insert_own" on public.saved_prompts for insert with check (auth.uid() = user_id);
create policy "prompts_update_own" on public.saved_prompts for update using (auth.uid() = user_id);
create policy "prompts_delete_own" on public.saved_prompts for delete using (auth.uid() = user_id);

create index if not exists idx_saved_prompts_user_id on public.saved_prompts(user_id);
create index if not exists idx_saved_prompts_created_at on public.saved_prompts(created_at desc);`

export default function SetupPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SQL_SETUP)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-primary">
            Configuração do Banco de Dados
          </h1>
          <p className="text-muted-foreground">
            Siga as instruções abaixo para configurar o Supabase
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Passo 1: Acesse o Supabase</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Vá para <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">supabase.com</a></li>
                <li>Faça login no seu projeto</li>
                <li>Vá até <strong>SQL Editor</strong> na barra lateral</li>
                <li>Clique em <strong>New Query</strong></li>
              </ol>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Passo 2: Copie e Cole o SQL</CardTitle>
              <CardDescription>Clique no botão abaixo para copiar o SQL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={SQL_SETUP}
                readOnly
                className="min-h-96 font-mono text-sm"
              />
              <Button
                onClick={handleCopy}
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar SQL
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Passo 3: Execute no Supabase</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 list-decimal list-inside">
                <li>Cole o SQL copiado no editor do Supabase</li>
                <li>Clique no botão <strong>Run</strong> (ou Ctrl+Enter)</li>
                <li>Aguarde a conclusão da execução</li>
              </ol>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Passo 4: Volte para o App</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Após executar o SQL com sucesso, volte para o app e use normalmente!
              </p>
              <a href="/">
                <Button className="w-full bg-[#F2A900] text-black hover:bg-[#F2A900]/90">
                  Voltar para o App
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
