import { useCallback, useEffect, useState } from 'react'
import {
  ApiError,
  createTask,
  deleteTask,
  getRandomTasks,
  listTasks,
  updateTask,
} from './api/client'
import { AddTaskForm } from './components/AddTaskForm'
import { Hero } from './components/Hero'
import { RandomResults } from './components/RandomResults'
import { TaskList } from './components/TaskList'
import type { Task, TaskStatus } from './types'
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
  const [tasks, setTasks] = useState<Task[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [createBusy, setCreateBusy] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [rowBusyId, setRowBusyId] = useState<number | null>(null)
  const [shuffleBusy, setShuffleBusy] = useState(false)
  const [shuffleError, setShuffleError] = useState<string | null>(null)
  const [randomTasks, setRandomTasks] = useState<string[]>([])
  const [showRandom, setShowRandom] = useState(false)
  const [shuffleKey, setShuffleKey] = useState(0)

  const refreshTasks = useCallback(async () => {
    setListLoading(true)
    setListError(null)
    try {
      const response = await listTasks()
      setTasks(response.tasks)
    } catch (error) {
      setListError(messageFromError(error))
    } finally {
      setListLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshTasks()
  }, [refreshTasks])

  async function handleShuffle() {
    setShuffleBusy(true)
    setShuffleError(null)
    try {
      const response = await getRandomTasks()
      setRandomTasks(response.tasks)
      setShowRandom(true)
      setShuffleKey((value) => value + 1)
    } catch (error) {
      setShuffleError(messageFromError(error))
    } finally {
      setShuffleBusy(false)
    }
  }

  async function handleCreate(title: string) {
    setCreateBusy(true)
    setCreateError(null)
    try {
      const created = await createTask({ title })
      setTasks((current) => [...current, created])
    } catch (error) {
      setCreateError(messageFromError(error))
      throw error
    } finally {
      setCreateBusy(false)
    }
  }

  async function handleUpdate(id: number, title: string) {
    setRowBusyId(id)
    setListError(null)
    try {
      const updated = await updateTask(id, { title })
      setTasks((current) =>
        current.map((task) => (task.id === id ? updated : task)),
      )
    } catch (error) {
      setListError(messageFromError(error))
      throw error
    } finally {
      setRowBusyId(null)
    }
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    setRowBusyId(id)
    setListError(null)
    try {
      const updated = await updateTask(id, { status })
      setTasks((current) =>
        current.map((task) => (task.id === id ? updated : task)),
      )
    } catch (error) {
      setListError(messageFromError(error))
    } finally {
      setRowBusyId(null)
    }
  }

  async function handleDelete(id: number) {
    setRowBusyId(id)
    setListError(null)
    try {
      await deleteTask(id)
      setTasks((current) => current.filter((task) => task.id !== id))
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
        tasks={randomTasks}
        visible={showRandom}
      />
      <main className={styles.manage}>
        <AddTaskForm
          onSubmit={handleCreate}
          busy={createBusy}
          error={createError}
        />
        <TaskList
          tasks={tasks}
          loading={listLoading}
          error={listError}
          busyId={rowBusyId}
          onUpdate={handleUpdate}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}
