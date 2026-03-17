'use server'

import { createClient } from '@/lib/supabase/server'

export interface SavedPrompt {
  id: string
  name: string
  prompt_en: string
  prompt_pt: string
  style: string
  character: string
  action: string
  setting: string
  lighting: string
  composition: string
  created_at: string
  updated_at: string
}

export async function savePromptToDatabase(prompt: Omit<SavedPrompt, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Não autenticado')
  }

  const { data, error } = await supabase
    .from('saved_prompts')
    .insert({
      user_id: session.user.id,
      ...prompt,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getSavedPrompts() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Não autenticado')
  }

  const { data, error } = await supabase
    .from('saved_prompts')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updatePrompt(id: string, updates: Partial<SavedPrompt>) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Não autenticado')
  }

  const { data, error } = await supabase
    .from('saved_prompts')
    .update(updates)
    .eq('id', id)
    .eq('user_id', session.user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePrompt(id: string) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error('Não autenticado')
  }

  const { error } = await supabase
    .from('saved_prompts')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id)

  if (error) throw error
}
