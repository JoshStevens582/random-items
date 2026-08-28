import { useCallback, useEffect, useState } from 'react'
import {
  ApiError,
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from './api/client'
import { AddTaskForm } from './components/AddTaskForm'
import { Hero } from './components/Hero'
import { TaskList } from './components/TaskList'
import type { Task, TaskPriority, TaskStatus, TaskUpdate } from './types'
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

  async function handleCreate(
    title: string,
    priority: TaskPriority = 'medium',
    dueDate: string | null = null,
  ) {
    setCreateBusy(true)
    setCreateError(null)
    try {
      const created = await createTask({
        title,
        priority,
        due_date: dueDate,
      })
      setTasks((current) => [...current, created])
    } catch (error) {
      setCreateError(messageFromError(error))
      throw error
    } finally {
      setCreateBusy(false)
    }
  }

  async function handleUpdate(id: number, payload: TaskUpdate) {
    setRowBusyId(id)
    setListError(null)
    try {
      const updated = await updateTask(id, payload)
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

  async function handlePriorityChange(id: number, priority: TaskPriority) {
    setRowBusyId(id)
    setListError(null)
    try {
      const updated = await updateTask(id, { priority })
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
      <Hero />
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
          onPriorityChange={handlePriorityChange}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}
