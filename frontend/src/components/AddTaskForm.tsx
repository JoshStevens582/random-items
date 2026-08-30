import { useState } from 'react'
import type { FormEvent } from 'react'
import type { TaskPriority } from '../types'
import styles from './AddTaskForm.module.css'

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

interface AddTaskFormProps {
  onSubmit: (
    title: string,
    priority: TaskPriority,
    dueDate: string | null,
  ) => Promise<void>
  busy: boolean
  error: string | null
}

export function AddTaskForm({ onSubmit, busy, error }: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      return
    }
    try {
      await onSubmit(trimmed, priority, dueDate ? dueDate : null)
      setTitle('')
      setPriority('medium')
      setDueDate('')
    } catch {
      // Error is surfaced by the parent via the error prop.
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Add a task</h2>
        <p className={styles.subtitle}>
          Add a title with optional priority and due date.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. buy groceries"
            maxLength={500}
            disabled={busy}
            required
            aria-label="Task title"
          />
          <select
            className={styles.select}
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
            disabled={busy}
            aria-label="Task priority"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            className={styles.dateInput}
            type="date"
            name="dueDate"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            disabled={busy}
            aria-label="Task due date"
          />
          <button
            type="submit"
            className={styles.submit}
            disabled={busy || title.trim().length === 0}
          >
            {busy ? 'Adding…' : 'Add'}
          </button>
        </form>
        {error ? <p className={styles.error}>{error}</p> : null}
      </div>
    </section>
  )
}
