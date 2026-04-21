import { Draggable } from '@hello-pangea/dnd'

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  assignee: { id: string; name: string; email: string } | null
  creator: { id: string; name: string; email: string }
}

interface Props {
  task: Task
  index: number
  onDelete?: (taskId: string) => void
}

export function TaskCard({ task, index, onDelete }: Props) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="rounded-xl p-3 mb-2 group"
          style={{
            background: snapshot.isDragging ? '#2a2050' : '#1a1a2e',
            border: `0.5px solid ${snapshot.isDragging ? '#7c6fe0' : '#2a2a45'}`,
            cursor: 'grab',
            ...provided.draggableProps.style,
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-snug" style={{ color: '#e8e8f0' }}>
              {task.title}
            </p>
            {onDelete && (
              <button
                onClick={() => onDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-opacity"
                style={{ background: 'none', color: '#4a4a6a', fontSize: 16, lineHeight: 1, padding: 0 }}
              >
                ×
              </button>
            )}
          </div>

          {task.description && (
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: '#5a5a7a' }}>
              {task.description}
            </p>
          )}

          <div className="flex items-center mt-3">
            {task.assignee ? (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium" style={{ background: '#2a2050', color: '#8b7cf8' }}>
                  {task.assignee.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs" style={{ color: '#6b6b8a' }}>{task.assignee.name}</span>
              </div>
            ) : (
              <span className="text-xs" style={{ color: '#3a3a5a' }}>Sem responsável</span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
