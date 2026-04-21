import { Droppable } from '@hello-pangea/dnd'
import { TaskCard } from './TaskCard'

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  assignee: { id: string; name: string; email: string } | null
  creator: { id: string; name: string; email: string }
}

interface Props {
  id: string
  title: string
  color: string
  tasks: Task[]
  onDelete?: (taskId: string) => void
}

export function KanbanColumn({ id, title, color, tasks, onDelete }: Props) {
  return (
    <div style={{ minWidth: 280, flex: 1, maxWidth: 360 }}>
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }}></div>
        <span className="text-sm font-medium" style={{ color: '#c8c8e8' }}>{title}</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: '#1a1a2e', color: '#6b6b8a', border: '0.5px solid #2a2a45' }}>
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="rounded-xl p-2 min-h-24 transition-colors"
            style={{
              background: snapshot.isDraggingOver ? '#1e1e32' : '#13131f',
              border: `0.5px solid ${snapshot.isDraggingOver ? '#3a3a55' : '#1e1e2e'}`,
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onDelete={onDelete} />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <p className="text-xs text-center py-6" style={{ color: '#3a3a5a' }}>
                Sem tarefas
              </p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
