import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Item } from '../types'
import styles from './ItemList.module.css'

interface ItemListProps {
  items: Item[]
  loading: boolean
  error: string | null
  busyId: number | null
  onUpdate: (id: number, content: string) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function ItemList({
  items,
  loading,
  error,
  busyId,
  onUpdate,
  onDelete,
}: ItemListProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState('')

  function startEdit(item: Item) {
    setEditingId(item.id)
    setDraft(item.content)
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
        <h2 className={styles.title}>Your collection</h2>
        <p className={styles.subtitle}>
          Edit or remove items anytime.
        </p>

        {loading ? <p className={styles.status}>Loading items…</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        {!loading && !error && items.length === 0 ? (
          <p className={styles.status}>No items yet. Add one above.</p>
        ) : null}

        <ul className={styles.list}>
          {items.map((item) => {
            const rowBusy = busyId === item.id
            const isEditing = editingId === item.id

            return (
              <li key={item.id} className={styles.row}>
                {isEditing ? (
                  <form
                    className={styles.editForm}
                    onSubmit={(event) => handleSave(event, item.id)}
                  >
                    <input
                      className={styles.editInput}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      maxLength={500}
                      disabled={rowBusy}
                      aria-label="Edit item content"
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
                      <p>{item.content}</p>
                      <span className={styles.meta}>
                        #{item.id} ·{' '}
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.action}
                        onClick={() => startEdit(item)}
                        disabled={busyId !== null}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`${styles.action} ${styles.danger}`}
                        onClick={() => onDelete(item.id)}
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
