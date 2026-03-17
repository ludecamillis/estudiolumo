'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllPrompts, deletePrompt, type SavedPrompt } from '@/lib/prompt-storage'
import { Copy, Check, Trash2, Eye, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { SavedPromptViewer } from '@/components/saved-prompt-viewer'

export default function MeusPromptsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [localPrompts, setLocalPrompts] = useState<SavedPrompt[]>([])
  const [cloudPrompts, setCloudPrompts] = useState<any[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<SavedPrompt | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setLocalPrompts(getAllPrompts())
  }, [])

  useEffect(() => {
    if (!loading && user) {
      fetchCloudPrompts()
    } else if (!loading && !user) {
      // Redirect to home/login if not authenticated
      router.push('/')
    }
  }, [user, loading, router])

  const fetchCloudPrompts = async () => {
    try {
      const response = await fetch('/api/prompts/list')
      if (response.ok) {
        const data = await response.json()
        setCloudPrompts(data.prompts || [])
      }
    } catch (error) {
      console.debug('Error fetching cloud prompts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    toast.success('Prompt copiado!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDeleteLocal = (id: string) => {
    deletePrompt(id)
    setLocalPrompts(getAllPrompts())
    toast.success('Prompt deletado!')
  }

  const handleDeleteCloud = async (id: string) => {
    try {
      const response = await fetch('/api/prompts/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId: id }),
      })

      if (response.ok) {
        setCloudPrompts(cloudPrompts.filter((p: any) => p.id !== id))
        toast.success('Prompt deletado!')
      }
    } catch (error) {
      console.debug('Error deleting cloud prompt:', error)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 py-12">
        <p className="text-center text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  const isEmpty = localPrompts.length === 0 && cloudPrompts.length === 0

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-primary">Meus Prompts</h1>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        {isEmpty ? (
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Nenhum prompt salvo</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/">
                <Button>Criar Novo Prompt</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {user && cloudPrompts.length > 0 && (
              <div className="mb-12">
                <h2 className="mb-4 text-2xl font-bold">Prompts na Nuvem</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {cloudPrompts.map((prompt: any) => (
                    <Card key={prompt.id}>
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2">{prompt.title || 'Sem título'}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">{prompt.content}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={() => handleCopy(prompt.content, prompt.id)}
                          >
                            {copiedId === prompt.id ? (
                              <>
                                <Check className="h-4 w-4" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copiar
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteCloud(prompt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {localPrompts.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-bold">Prompts Locais</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {localPrompts.map((prompt) => (
                    <Card key={prompt.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{prompt.character}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-3">{prompt.promptEn}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={() => handleCopy(prompt.promptEn, prompt.id)}
                          >
                            {copiedId === prompt.id ? (
                              <>
                                <Check className="h-4 w-4" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                Copiar
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedPrompt(prompt)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteLocal(prompt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {selectedPrompt && (
          <SavedPromptViewer prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />
        )}
      </div>
    </div>
  )
}
