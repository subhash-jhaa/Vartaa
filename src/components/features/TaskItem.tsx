'use client'
import { useQuery, useMutation } from 'convex/react'
import { useAction } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import { useState } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Plus, Check, Loader2 } from 'lucide-react'

export default function RoomTasksPanel({ roomId }: { roomId: Id<'rooms'> }) {
  const tasks = useQuery(api.tasks.getRoomTasks, { roomId })
  const toggleTask = useMutation(api.tasks.toggleTask)
  const createTask = useMutation(api.tasks.createTask)
  const { isAuthenticated } = useCurrentUser()
  const [newTitle, setNewTitle] = useState('')
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    if (!newTitle.trim() || !isAuthenticated) return
    await createTask({ roomId, title: newTitle.trim() })
    setNewTitle('')
    setAdding(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--obsidian-bg)' }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--obsidian-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 10, fontWeight: 700, color: 'var(--obsidian-text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>Project Tasks</h3>
        <button onClick={() => setAdding((a) => !a)} style={{ fontSize: 10, color: 'var(--obsidian-primary)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', fontWeight: 600 }}>
          <Plus size={10} />
          Add
        </button>
      </div>

      {adding && (
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--obsidian-border)', background: 'var(--obsidian-surface-soft)' }}>
          <input
            autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="What needs to be done?"
            style={{ width: '100%', background: 'var(--obsidian-surface)', border: '1px solid var(--obsidian-border)', borderRadius: 8, padding: '10px 14px', color: 'var(--obsidian-text)', fontSize: 13, outline: 'none', boxSizing: 'border-box', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
          />
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {tasks === undefined && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--obsidian-text-faint)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Loader2 size={16} className="animate-spin" />
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading tasks...</span>
          </div>
        )}
        {tasks?.length === 0 && !adding && (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--obsidian-text-faint)', fontStyle: 'italic', margin: 0 }}>No active tasks in this room.</p>
          </div>
        )}
        {tasks?.map((task) => (
          <div
            key={task._id}
            style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 20px', transition: 'background 0.2s', cursor: 'pointer', borderBottom: '1px solid var(--obsidian-border-alpha)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--obsidian-surface-soft)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            onClick={() => toggleTask({ taskId: task._id }).catch(console.error)}
          >
            <button
              style={{ width: 18, height: 18, borderRadius: 6, border: `1.5px solid ${task.isDone ? 'var(--obsidian-primary)' : 'var(--obsidian-border)'}`, background: task.isDone ? 'var(--obsidian-primary-alpha)' : 'none', cursor: 'pointer', flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            >
              {task.isDone && <Check size={12} color="var(--obsidian-primary)" strokeWidth={3} />}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, color: task.isDone ? 'var(--obsidian-text-muted)' : 'var(--obsidian-text)', textDecoration: task.isDone ? 'line-through' : 'none', margin: 0, lineHeight: 1.4, transition: 'all 0.2s' }}>
                {task.title}
              </p>
              {task.dueDate && <span style={{ fontSize: 10, color: 'var(--obsidian-text-faint)', marginTop: 4, display: 'block' }}>Due: {task.dueDate}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
