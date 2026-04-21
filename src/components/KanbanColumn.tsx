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
    <div style={{
      background: '#f8f8f8',
      borderRadius: 12,
      padding: '16px',
      minWidth: 280,
      flex: 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
        }} />
        <h3 style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{title}</h3>
        <span style={{
          marginLeft: 'auto',
          fontSize: 12,
          color: '#888',
          background: '#e8e8e8',
          borderRadius: 20,
          padding: '1px 8px',
        }}>
          {tasks.length}
        </span>
      </div>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: 80,
              background: snapshot.isDraggingOver ? '#efefff' : 'transparent',
              borderRadius: 8,
              transition: 'background 0.2s',
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onDelete={onDelete} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
