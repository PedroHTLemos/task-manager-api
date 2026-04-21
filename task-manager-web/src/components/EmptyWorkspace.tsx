import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'

export function EmptyWorkspace() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const createWorkspace = useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post('/workspaces', { name })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
  })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await createWorkspace.mutateAsync(name)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="mb-6">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="14" fill="#1a1a2e"/>
          <rect x="11" y="22" width="5" height="16" rx="2.5" fill="#2a2050"/>
          <rect x="19" y="15" width="5" height="23" rx="2.5" fill="#3a3060"/>
          <rect x="27" y="10" width="5" height="28" rx="2.5" fill="#4a3fa0"/>
          <rect x="35" y="18" width="5" height="20" rx="2.5" fill="#3a3060"/>
        </svg>
      </div>

      <h2 className="text-lg font-medium text-white mb-2">Nenhum workspace ainda</h2>
      <p className="text-sm text-center mb-8" style={{ color: '#6b6b8a', maxWidth: 300 }}>
        Crie seu primeiro workspace para começar a organizar as tarefas da sua equipe.
      </p>

      <form onSubmit={handleSubmit} className="w-full" style={{ maxWidth: 320 }}>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Nome do workspace"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="py-3 rounded-xl text-sm font-medium text-white"
            style={{ background: loading ? '#4a3fa0' : '#7c6fe0' }}
          >
            {loading ? 'Criando...' : 'Criar workspace'}
          </button>
        </div>
      </form>
    </div>
  )
}
