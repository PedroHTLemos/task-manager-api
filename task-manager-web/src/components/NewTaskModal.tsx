import { useState } from 'react'
import type { FormEvent } from 'react'

interface Props {
  onClose: () => void
  onCreate: (data: { title: string; description?: string }) => void
  loading: boolean
}

export function NewTaskModal({ onClose, onCreate, loading }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onCreate({ title, description: description || undefined })
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4 z-50"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#1a1a2e', border: '0.5px solid #2a2a45' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-medium text-white">Nova tarefa</h2>
          <button onClick={onClose} style={{ background: 'none', color: '#6b6b8a', fontSize: 20, padding: 0, lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: '#8888aa' }}>Título</label>
            <input
              type="text"
              placeholder="Nome da tarefa"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs" style={{ color: '#8888aa' }}>Descrição <span style={{ color: '#4a4a6a' }}>(opcional)</span></label>
            <textarea
              placeholder="Detalhes sobre a tarefa..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm"
              style={{ background: '#0f0f14', border: '0.5px solid #2a2a45', color: '#6b6b8a' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: loading ? '#4a3fa0' : '#7c6fe0' }}
            >
              {loading ? 'Criando...' : 'Criar tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
