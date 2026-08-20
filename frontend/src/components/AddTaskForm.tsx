import { useState } from 'react'
import type { FormEvent } from 'react'
import styles from './AddTaskForm.module.css'

interface AddTaskFormProps {
  onSubmit: (title: string) => Promise<void>
  busy: boolean
  error: string | null
}

export function AddTaskForm({ onSubmit, busy, error }: AddTaskFormProps) {
  const [title, setTitle] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) {
      return
    }
    try {
      await onSubmit(trimmed)
      setTitle('')
    } catch {
      // Error is surfaced by the parent via the error prop.
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Add a task</h2>
        <p className={styles.subtitle}>
          Store a title in your collection.
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
