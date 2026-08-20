import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Task } from '../types'
import styles from './TaskList.module.css'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  error: string | null
  busyId: number | null
  onUpdate: (id: number, title: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function TaskList({
  tasks,
  loading,
  error,
  busyId,
  onUpdate,
  onDelete,
}: TaskListProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState('')

  function startEdit(task: Task) {
    setEditingId(task.id)
    setDraft(task.title)
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft('')
  }

  async function handleSave(event: FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) {
      return
    }
    try {
      await onUpdate(id, trimmed)
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
          Edit or remove tasks anytime.
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
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      maxLength={500}
                      disabled={rowBusy}
                      aria-label="Edit task title"
                      autoFocus
                    />
                    <div className={styles.actions}>
                      <button
                        type="submit"
                        className={styles.action}
                        disabled={rowBusy || draft.trim().length === 0}
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
                      <p>{task.title}</p>
                      <span className={styles.meta}>
                        #{task.id} ·{' '}
                        {new Date(task.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.actions}>
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
                        {rowBusy ? 'Deleting…' : 'Delete'}
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
