export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskSortBy = 'created_at' | 'due_date' | 'priority' | 'id'
export type TaskSortOrder = 'asc' | 'desc'

export interface Task {
  id: number
  title: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  created_at: string
}

export interface TaskListResponse {
  tasks: Task[]
  count: number
}

export interface TaskCreate {
  title: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string | null
}

export interface TaskUpdate {
  title?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string | null
}

export interface TaskFilterParams {
  status?: TaskStatus | 'all'
  priority?: TaskPriority | 'all'
  sort_by?: TaskSortBy
  sort_order?: TaskSortOrder
}
