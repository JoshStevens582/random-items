import type {
  Task,
  TaskCreate,
  TaskFilterParams,
  TaskListResponse,
  TaskUpdate,
} from '../types'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ??
  'http://127.0.0.1:8000'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError(
      'Unable to reach the API. Is the server running on port 8000?',
      0,
    )
  }

  if (!response.ok) {
    let detail = `Request failed (${response.status})`
    try {
      const body = (await response.json()) as { detail?: unknown }
      if (typeof body.detail === 'string') {
        detail = body.detail
      } else if (Array.isArray(body.detail)) {
        detail = body.detail
          .map((entry) =>
            typeof entry === 'object' &&
            entry !== null &&
            'msg' in entry
              ? String((entry as { msg: string }).msg)
              : String(entry),
          )
          .join('; ')
      }
    } catch {
      // keep default detail
    }
    throw new ApiError(detail, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function listTasks(filters?: TaskFilterParams): Promise<TaskListResponse> {
  const params = new URLSearchParams()
  if (filters?.status && filters.status !== 'all') {
    params.set('status', filters.status)
  }
  if (filters?.priority && filters.priority !== 'all') {
    params.set('priority', filters.priority)
  }
  if (filters?.sort_by) {
    params.set('sort_by', filters.sort_by)
  }
  if (filters?.sort_order) {
    params.set('sort_order', filters.sort_order)
  }

  const query = params.toString()
  return request<TaskListResponse>(query ? `/tasks?${query}` : '/tasks')
}

export function createTask(payload: TaskCreate): Promise<Task> {
  return request<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateTask(
  taskId: number,
  payload: TaskUpdate,
): Promise<Task> {
  return request<Task>(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteTask(taskId: number): Promise<void> {
  return request<void>(`/tasks/${taskId}`, {
    method: 'DELETE',
  })
}
