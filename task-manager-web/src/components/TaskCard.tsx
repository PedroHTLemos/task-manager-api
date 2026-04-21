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
          style={{
            background: snapshot.isDragging ? '#f0f0ff' : 'white',
            border: '0.5px solid #e0e0e0',
            borderRadius: 8,
            padding: '12px 14px',
            marginBottom: 8,
            cursor: 'grab',
            ...provided.draggableProps.style,
          }}
        >
          <p style={{ fontWeight: 500, fontSize: 14, margin: '0 0 4px' }}>{task.title}</p>
          {task.description && (
            <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px' }}>{task.description}</p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {task.assignee ? (
              <span style={{ fontSize: 11, background: '#eeedfe', color: '#534ab7', padding: '2px 8px', borderRadius: 20 }}>
                {task.assignee.name}
              </span>
            ) : (
              <span style={{ fontSize: 11, color: '#aaa' }}>Sem responsável</span>
            )}
            {onDelete && (
              <button onClick={() => onDelete(task.id)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}>
                ×
              </button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
