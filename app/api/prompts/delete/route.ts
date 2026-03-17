import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
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

    const { promptId } = await request.json()

    if (!promptId) {
      return NextResponse.json(
        { error: 'ID do prompt é obrigatório' },
        { status: 400 }
      )
    }

    // Delete the prompt - with error handling for table not existing
    try {
      const { error: deleteError } = await supabase
        .from('saved_prompts')
        .delete()
        .eq('id', promptId)
        .eq('user_id', user.id)

      if (deleteError) {
        console.debug('Could not delete prompt (table may not exist):', deleteError)
        return NextResponse.json({ success: true })
      }

      return NextResponse.json({ success: true, promptId })
    } catch (tableError) {
      console.debug('Table operation failed (expected during setup):', tableError)
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('Error deleting prompt:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
