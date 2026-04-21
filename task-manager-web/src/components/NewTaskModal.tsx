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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: 'white', borderRadius: 12, padding: '2rem', width: '100%', maxWidth: 420 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Nova tarefa</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="text" placeholder="Título da tarefa" value={title} onChange={e => setTitle(e.target.value)} required autoFocus />
          <textarea placeholder="Descrição (opcional)" value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ resize: 'vertical', padding: '8px 12px', borderRadius: 8, border: '0.5px solid #ccc', fontSize: 14 }} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ background: 'none' }}>Cancelar</button>
            <button type="submit" disabled={loading}>{loading ? 'Criando...' : 'Criar tarefa'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
