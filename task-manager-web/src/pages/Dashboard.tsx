import { useState } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import { useAuth } from '../contexts/AuthContext'
import { useWorkspaces } from '../hooks/useWorkspaces'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks'
import { KanbanColumn } from '../components/KanbanColumn'
import { NewTaskModal } from '../components/NewTaskModal'
import { Logo } from '../components/Logo'

const COLUMNS = [
  { id: 'TODO', title: 'A fazer', color: '#4a4a6a' },
  { id: 'IN_PROGRESS', title: 'Em andamento', color: '#7c6fe0' },
  { id: 'DONE', title: 'Concluído', color: '#1D9E75' },
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

  const currentWorkspace = workspaces?.find((w: any) => w.id === workspaceId)

  return (
    <div className="min-h-screen" style={{ background: '#0f0f14' }}>

      <header className="flex items-center justify-between px-6 h-14 border-b" style={{ background: '#1a1a2e', borderColor: '#2a2a45' }}>
        <div className="flex items-center gap-6">
          <Logo size="sm" />
          {!loadingWorkspaces && workspaces?.length > 0 && (
            <select
              value={workspaceId}
              onChange={e => setSelectedWorkspaceId(e.target.value)}
              style={{
                background: '#0f0f14',
                border: '0.5px solid #2a2a45',
                borderRadius: 8,
                padding: '5px 10px',
                fontSize: 13,
                color: '#c8c8e8',
                width: 'auto',
              }}
            >
              {workspaces.map((w: any) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: '#2a2050', color: '#8b7cf8' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm" style={{ color: '#8888aa' }}>{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: '#1a1a2e', border: '0.5px solid #2a2a45', color: '#6b6b8a' }}
          >
            Sair
          </button>
        </div>
      </header>

      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-lg font-medium text-white">
            {currentWorkspace?.name ?? 'Carregando...'}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#6b6b8a' }}>
            {tasks?.length ?? 0} tarefas no total
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: '#7c6fe0' }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
          Nova tarefa
        </button>
      </div>

      {loadingTasks ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm" style={{ color: '#6b6b8a' }}>Carregando tarefas...</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 px-6 pb-6 overflow-x-auto">
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

      {showModal && (
        <NewTaskModal
          onClose={() => setShowModal(false)}
          onCreate={(data) => {
            createTask.mutate(data, { onSuccess: () => setShowModal(false) })
          }}
          loading={createTask.isPending}
        />
      )}
    </div>
  )
}
