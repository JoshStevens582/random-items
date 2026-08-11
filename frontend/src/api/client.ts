import type {
  Item,
  ItemCreate,
  ItemListResponse,
  ItemUpdate,
  RandomItemsResponse,
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

export function listItems(): Promise<ItemListResponse> {
  return request<ItemListResponse>('/items')
}

export function createItem(payload: ItemCreate): Promise<Item> {
  return request<Item>('/items', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateItem(
  itemId: number,
  payload: ItemUpdate,
): Promise<Item> {
  return request<Item>(`/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteItem(itemId: number): Promise<void> {
  return request<void>(`/items/${itemId}`, {
    method: 'DELETE',
  })
}

export function getRandomItems(): Promise<RandomItemsResponse> {
  return request<RandomItemsResponse>('/items/random')
}
