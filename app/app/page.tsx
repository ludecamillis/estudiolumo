'use client'

import { PromptBuilder } from '@/components/prompt-builder'

export default function AppPage() {
  // Middleware protects this route - only authenticated users can access
  return <PromptBuilder />
}
