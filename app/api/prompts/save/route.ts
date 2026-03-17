import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { title, content, style_preset } = await request.json()

    // Get user profile to check plan and prompt count
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('plan, prompts_used_this_month, month_reset_date')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.debug('Profile not found:', profileError)
      }

      // Check if month reset is needed
      const today = new Date()
      let promptCount = profile?.prompts_used_this_month || 0
      
      if (profile?.month_reset_date) {
        const resetDate = new Date(profile.month_reset_date)
        if (resetDate.getMonth() !== today.getMonth() || resetDate.getFullYear() !== today.getFullYear()) {
          promptCount = 0
        }
      }

      // If user is on free plan and has reached limit (3 prompts per month)
      if (profile?.plan === 'free' && promptCount >= 3) {
        return NextResponse.json(
          { error: 'Limite de prompts gratuitos atingido. Faça upgrade para PRO para prompts ilimitados.' },
          { status: 429 }
        )
      }

      // Save the prompt
      const { error: insertError, data } = await supabase
        .from('saved_prompts')
        .insert({
          user_id: user.id,
          title,
          content,
          style_preset,
        })
        .select()

      if (insertError) {
        console.debug('Insert error:', insertError)
        return NextResponse.json({ success: true, offline: true })
      }

      // Update prompt count only for free users
      if (profile?.plan === 'free') {
        await supabase
          .from('profiles')
          .update({
            prompts_used_this_month: promptCount + 1,
            month_reset_date: today.toISOString().split('T')[0],
          })
          .eq('id', user.id)
      }
      // PRO users have unlimited prompts, no need to update counter

      return NextResponse.json({ success: true, prompt: data })
    } catch (tableError) {
      console.debug('Table operation failed:', tableError)
      return NextResponse.json({ success: true, offline: true })
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar prompt' },
      { status: 500 }
    )
  }
}
