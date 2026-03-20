'use client'
import { useQuery, useMutation } from 'convex/react'
import { useAction } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { useState } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export default function RoomTasksPanel({ roomId }: { roomId: Id<'rooms'> }) {
  const tasks = useQuery(api.tasks.getRoomTasks, { roomId })
  const toggleTask = useMutation(api.tasks.toggleTask)
  const createTask = useMutation(api.tasks.createTask)
  const extractTask = useAction(api.actions.ai.extractTask)
  const { isAuthenticated } = useCurrentUser()
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    if (!newTitle.trim() || !isAuthenticated) return
    await createTask({ roomId, title: newTitle.trim() })
    setNewTitle('')
    setAdding(false)
  }

  void extractTask

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(240,237,230,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#f0ede6' }}>Tasks</span>
        <button onClick={() => setAdding((a) => !a)} style={{ fontSize: 12, color: '#6b6960', background: 'none', border: 'none', cursor: 'pointer' }}>+ Add</button>
      </div>

      {adding && (
        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(240,237,230,0.07)' }}>
          <input
            autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Task title..."
            style={{ width: '100%', background: '#1a1a18', border: '1px solid rgba(240,237,230,0.1)', borderRadius: 6, padding: '7px 10px', color: '#f0ede6', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {tasks === undefined && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b6960', fontSize: 12 }}>Loading...</div>
        )}
        {tasks?.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b6960', fontSize: 12 }}>No tasks yet</div>
        )}
        {tasks?.map((task) => (
          <div
            key={task._id}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 16px', transition: 'background 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(240,237,230,0.03)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            <button
              onClick={() => toggleTask({ taskId: task._id }).catch(console.error)}
              style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${task.isDone ? 'rgba(74,222,128,0.4)' : 'rgba(240,237,230,0.2)'}`, background: task.isDone ? 'rgba(74,222,128,0.1)' : 'none', cursor: 'pointer', flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#4ade80' }}
            >
              {task.isDone ? '✓' : ''}
            </button>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 13, color: task.isDone ? '#6b6960' : '#c8c5be', textDecoration: task.isDone ? 'line-through' : 'none' }}>
                {task.title}
              </span>
              {task.dueDate && <p style={{ fontSize: 11, color: '#6b6960', marginTop: 2 }}>Due: {task.dueDate}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
