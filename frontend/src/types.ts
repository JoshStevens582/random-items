export interface Task {
  id: number
  title: string
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
}

export interface TaskUpdate {
  title?: string
}
