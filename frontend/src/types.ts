export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: number
  title: string
  status: TaskStatus
  created_at: string
}

export interface TaskListResponse {
  tasks: Task[]
  count: number
}

export interface RandomTasksResponse {
  tasks: string[]
  count: number
}

export interface TaskCreate {
  title: string
  status?: TaskStatus
}

export interface TaskUpdate {
  title?: string
  status?: TaskStatus
}
