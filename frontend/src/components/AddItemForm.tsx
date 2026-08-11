import { useState } from 'react'
import type { FormEvent } from 'react'
import styles from './AddItemForm.module.css'

interface AddItemFormProps {
  onSubmit: (content: string) => Promise<void>
  busy: boolean
  error: string | null
}

export function AddItemForm({ onSubmit, busy, error }: AddItemFormProps) {
  const [content, setContent] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) {
      return
    }
    try {
      await onSubmit(trimmed)
      setContent('')
    } catch {
      // Error is surfaced by the parent via the error prop.
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Add an item</h2>
        <p className={styles.subtitle}>
          Store a string in your collection.
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="e.g. cold brew"
            maxLength={500}
            disabled={busy}
            required
            aria-label="Item content"
          />
          <button
            type="submit"
            className={styles.submit}
            disabled={busy || content.trim().length === 0}
          >
            {busy ? 'Adding…' : 'Add'}
          </button>
        </form>
        {error ? <p className={styles.error}>{error}</p> : null}
      </div>
    </section>
  )
}
