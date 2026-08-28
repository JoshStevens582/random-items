import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ApiError,
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from './api/client'
import { AddTaskForm } from './components/AddTaskForm'
import { DashboardStats } from './components/DashboardStats'
import { Hero } from './components/Hero'
import { TaskFilters } from './components/TaskFilters'
import { TaskList } from './components/TaskList'
import type {
  Task,
  TaskFilterParams,
  TaskPriority,
  TaskSortBy,
  TaskSortOrder,
  TaskStatus,
  TaskUpdate,
} from './types'
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
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [createBusy, setCreateBusy] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [rowBusyId, setRowBusyId] = useState<number | null>(null)

  // Filter state
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [sortBy, setSortBy] = useState<TaskSortBy>('created_at')
  const [sortOrder, setSortOrder] = useState<TaskSortOrder>('desc')

  const hasActiveFilters =
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    sortBy !== 'created_at' ||
    sortOrder !== 'desc'

  const refreshTasks = useCallback(async () => {
    setListLoading(true)
    setListError(null)
    try {
      const filters: TaskFilterParams = {
        status: statusFilter,
        priority: priorityFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
      }
      const [filteredRes, allRes] = await Promise.all([
        listTasks(filters),
        listTasks(),
      ])
      setTasks(filteredRes.tasks)
      setAllTasks(allRes.tasks)
    } catch (error) {
      setListError(messageFromError(error))
    } finally {
      setListLoading(false)
    }
  }, [statusFilter, priorityFilter, sortBy, sortOrder])

  useEffect(() => {
    void refreshTasks()
  }, [refreshTasks])

  // Stats derived from all tasks
  const stats = useMemo(() => {
    const total = allTasks.length
    const todo = allTasks.filter((t) => t.status === 'todo').length
    const inProgress = allTasks.filter((t) => t.status === 'in_progress').length
    const done = allTasks.filter((t) => t.status === 'done').length
    return { total, todo, inProgress, done }
  }, [allTasks])

  function handleResetFilters() {
    setStatusFilter('all')
    setPriorityFilter('all')
    setSortBy('created_at')
    setSortOrder('desc')
  }

  function handleToggleSortOrder() {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  async function handleCreate(
    title: string,
    priority: TaskPriority = 'medium',
    dueDate: string | null = null,
  ) {
    setCreateBusy(true)
    setCreateError(null)
    try {
      await createTask({
        title,
        priority,
        due_date: dueDate,
      })
      await refreshTasks()
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
      await updateTask(id, payload)
      await refreshTasks()
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
      await updateTask(id, { status })
      await refreshTasks()
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
      await updateTask(id, { priority })
      await refreshTasks()
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
      await refreshTasks()
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
        <DashboardStats
          total={stats.total}
          todo={stats.todo}
          inProgress={stats.inProgress}
          done={stats.done}
        />
        <AddTaskForm
          onSubmit={handleCreate}
          busy={createBusy}
          error={createError}
        />
        <TaskFilters
          status={statusFilter}
          priority={priorityFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onSortByChange={setSortBy}
          onSortOrderToggle={handleToggleSortOrder}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
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
