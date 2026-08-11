import { useCallback, useEffect, useState } from 'react'
import {
  ApiError,
  createItem,
  deleteItem,
  getRandomItems,
  listItems,
  updateItem,
} from './api/client'
import { AddItemForm } from './components/AddItemForm'
import { Hero } from './components/Hero'
import { ItemList } from './components/ItemList'
import { RandomResults } from './components/RandomResults'
import type { Item } from './types'
import styles from './App.module.css'

function messageFromError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Something went wrong'
}

export default function App() {
  const [items, setItems] = useState<Item[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [createBusy, setCreateBusy] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [rowBusyId, setRowBusyId] = useState<number | null>(null)
  const [shuffleBusy, setShuffleBusy] = useState(false)
  const [shuffleError, setShuffleError] = useState<string | null>(null)
  const [randomItems, setRandomItems] = useState<string[]>([])
  const [showRandom, setShowRandom] = useState(false)
  const [shuffleKey, setShuffleKey] = useState(0)

  const refreshItems = useCallback(async () => {
    setListLoading(true)
    setListError(null)
    try {
      const response = await listItems()
      setItems(response.items)
    } catch (error) {
      setListError(messageFromError(error))
    } finally {
      setListLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshItems()
  }, [refreshItems])

  async function handleShuffle() {
    setShuffleBusy(true)
    setShuffleError(null)
    try {
      const response = await getRandomItems()
      setRandomItems(response.items)
      setShowRandom(true)
      setShuffleKey((value) => value + 1)
    } catch (error) {
      setShuffleError(messageFromError(error))
    } finally {
      setShuffleBusy(false)
    }
  }

  async function handleCreate(content: string) {
    setCreateBusy(true)
    setCreateError(null)
    try {
      const created = await createItem({ content })
      setItems((current) => [...current, created])
    } catch (error) {
      setCreateError(messageFromError(error))
      throw error
    } finally {
      setCreateBusy(false)
    }
  }

  async function handleUpdate(id: number, content: string) {
    setRowBusyId(id)
    setListError(null)
    try {
      const updated = await updateItem(id, { content })
      setItems((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      )
    } catch (error) {
      setListError(messageFromError(error))
      throw error
    } finally {
      setRowBusyId(null)
    }
  }

  async function handleDelete(id: number) {
    setRowBusyId(id)
    setListError(null)
    try {
      await deleteItem(id)
      setItems((current) => current.filter((item) => item.id !== id))
    } catch (error) {
      setListError(messageFromError(error))
    } finally {
      setRowBusyId(null)
    }
  }

  return (
    <div className={styles.app}>
      <Hero
        onShuffle={() => void handleShuffle()}
        busy={shuffleBusy}
        error={shuffleError}
      />
      <RandomResults
        key={shuffleKey}
        items={randomItems}
        visible={showRandom}
      />
      <main className={styles.manage}>
        <AddItemForm
          onSubmit={handleCreate}
          busy={createBusy}
          error={createError}
        />
        <ItemList
          items={items}
          loading={listLoading}
          error={listError}
          busyId={rowBusyId}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}
