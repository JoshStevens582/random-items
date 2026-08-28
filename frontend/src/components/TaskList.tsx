import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Task, TaskPriority, TaskStatus, TaskUpdate } from '../types'
import styles from './TaskList.module.css'

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  error: string | null
  busyId: number | null
  onUpdate: (id: number, payload: TaskUpdate) => Promise<void>
  onStatusChange: (id: number, status: TaskStatus) => Promise<void>
  onPriorityChange: (id: number, priority: TaskPriority) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function TaskList({
  tasks,
  loading,
  error,
  busyId,
  onUpdate,
  onStatusChange,
  onPriorityChange,
  onDelete,
}: TaskListProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftPriority, setDraftPriority] = useState<TaskPriority>('medium')
  const [draftDueDate, setDraftDueDate] = useState('')

  function startEdit(task: Task) {
    setEditingId(task.id)
    setDraftTitle(task.title)
    setDraftPriority(task.priority)
    setDraftDueDate(task.due_date ?? '')
  }

  function cancelEdit() {
    setEditingId(null)
    setDraftTitle('')
    setDraftPriority('medium')
    setDraftDueDate('')
  }

  async function handleSave(event: FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault()
    const trimmed = draftTitle.trim()
    if (!trimmed) {
      return
    }
    try {
      await onUpdate(id, {
        title: trimmed,
        priority: draftPriority,
        due_date: draftDueDate ? draftDueDate : null,
      })
      cancelEdit()
    } catch {
      // Error is surfaced by the parent via the error prop.
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Your tasks</h2>
        <p className={styles.subtitle}>
          Edit, prioritize, set due dates, or remove tasks anytime.
        </p>

        {loading ? <p className={styles.status}>Loading tasks…</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        {!loading && !error && tasks.length === 0 ? (
          <p className={styles.status}>No tasks yet. Add one above.</p>
        ) : null}

        <ul className={styles.list}>
          {tasks.map((task) => {
            const rowBusy = busyId === task.id
            const isEditing = editingId === task.id

            return (
              <li key={task.id} className={styles.row}>
                {isEditing ? (
                  <form
                    className={styles.editForm}
                    onSubmit={(event) => handleSave(event, task.id)}
                  >
                    <input
                      className={styles.editInput}
                      value={draftTitle}
                      onChange={(event) => setDraftTitle(event.target.value)}
                      maxLength={500}
                      disabled={rowBusy}
                      aria-label="Edit task title"
                      autoFocus
                    />
                    <select
                      className={styles.select}
                      value={draftPriority}
                      onChange={(event) =>
                        setDraftPriority(event.target.value as TaskPriority)
                      }
                      disabled={rowBusy}
                      aria-label="Edit task priority"
                    >
                      {PRIORITY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label} priority
                        </option>
                      ))}
                    </select>
                    <input
                      className={styles.dateInput}
                      type="date"
                      value={draftDueDate}
                      onChange={(event) => setDraftDueDate(event.target.value)}
                      disabled={rowBusy}
                      aria-label="Edit task due date"
                    />
                    <div className={styles.actions}>
                      <button
                        type="submit"
                        className={styles.action}
                        disabled={rowBusy || draftTitle.trim().length === 0}
                      >
                        {rowBusy ? 'Saving…' : 'Save'}
                      </button>
                      <button
                        type="button"
                        className={styles.action}
                        onClick={cancelEdit}
                        disabled={rowBusy}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className={styles.content}>
                      <div className={styles.titleRow}>
                        <p className={styles.taskTitle}>{task.title}</p>
                        <span
                          className={`${styles.priorityBadge} ${
                            styles[`priority_${task.priority}`]
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <span className={styles.meta}>
                        #{task.id} ·{' '}
                        {new Date(task.created_at).toLocaleString()}
                        {task.due_date ? ` · Due: ${task.due_date}` : ''}
                      </span>
                    </div>
                    <div className={styles.actions}>
                      <select
                        className={styles.select}
                        value={task.status}
                        disabled={busyId !== null}
                        aria-label={`Status for ${task.title}`}
                        onChange={(event) => {
                          void onStatusChange(
                            task.id,
                            event.target.value as TaskStatus,
                          )
                        }}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <select
                        className={styles.select}
                        value={task.priority}
                        disabled={busyId !== null}
                        aria-label={`Priority for ${task.title}`}
                        onChange={(event) => {
                          void onPriorityChange(
                            task.id,
                            event.target.value as TaskPriority,
                          )
                        }}
                      >
                        {PRIORITY_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className={styles.action}
                        onClick={() => startEdit(task)}
                        disabled={busyId !== null}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${styles.action} ${styles.danger}`}
                        onClick={() => onDelete(task.id)}
                        disabled={busyId !== null}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
