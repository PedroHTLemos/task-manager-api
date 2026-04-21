import { useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useAuth } from '../contexts/AuthContext'
import { useWorkspaces } from '../hooks/useWorkspaces'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks'
import { KanbanColumn } from '../components/KanbanColumn'
import { NewTaskModal } from '../components/NewTaskModal'

const COLUMNS = [
  { id: 'TODO', title: 'A fazer', color: '#888' },
  { id: 'IN_PROGRESS', title: 'Em andamento', color: '#f59e0b' },
  { id: 'DONE', title: 'Concluído', color: '#10b981' },
]

export function Dashboard() {
  const { user, logout } = useAuth()
  const { data: workspaces, isLoading: loadingWorkspaces } = useWorkspaces()
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('')
  const [showModal, setShowModal] = useState(false)

  const workspaceId = selectedWorkspaceId || workspaces?.[0]?.id || ''

  const { data: tasks, isLoading: loadingTasks } = useTasks(workspaceId)
  const createTask = useCreateTask(workspaceId)
  const updateTask = useUpdateTask(workspaceId)
  const deleteTask = useDeleteTask(workspaceId)

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    const { draggableId, destination } = result
    const newStatus = destination.droppableId

    const task = tasks?.find((t: any) => t.id === draggableId)
    if (!task || task.status === newStatus) return

    updateTask.mutate({ taskId: draggableId, status: newStatus })
  }

  function getTasksByStatus(status: string) {
    return tasks?.filter((t: any) => t.status === status) ?? []
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '0.5px solid #e8e8e8',
        padding: '0 2rem',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Task Manager</h1>
          {!loadingWorkspaces && workspaces?.length > 0 && (
            <select
              value={workspaceId}
              onChange={e => setSelectedWorkspaceId(e.target.value)}
              style={{ fontSize: 14, border: '0.5px solid #ddd', borderRadius: 6, padding: '4px 8px' }}
            >
              {workspaces.map((w: any) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 14, color: '#666' }}>{user?.name}</span>
          <button onClick={logout} style={{ fontSize: 13 }}>Sair</button>
        </div>
      </header>

      {/* Toolbar */}
      <div style={{ padding: '1.5rem 2rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>
          {workspaces?.find((w: any) => w.id === workspaceId)?.name ?? 'Carregando...'}
        </h2>
        <button onClick={() => setShowModal(true)}>+ Nova tarefa</button>
      </div>

      {/* Kanban */}
      {loadingTasks ? (
        <p style={{ padding: '0 2rem', color: '#888' }}>Carregando tarefas...</p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div style={{ display: 'flex', gap: 16, padding: '0 2rem 2rem', alignItems: 'flex-start' }}>
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                color={col.color}
                tasks={getTasksByStatus(col.id)}
                onDelete={(taskId) => deleteTask.mutate(taskId)}
              />
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Modal */}
      {showModal && (
        <NewTaskModal
          onClose={() => setShowModal(false)}
          onCreate={(data) => {
            createTask.mutate(data, {
              onSuccess: () => setShowModal(false),
            })
          }}
          loading={createTask.isPending}
        />
      )}
    </div>
  )
}
