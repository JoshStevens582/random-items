export interface Item {
  id: number
  content: string
  created_at: string
}

export interface ItemListResponse {
  items: Item[]
  count: number
}

export interface RandomItemsResponse {
  items: string[]
  count: number
}

export interface ItemCreate {
  content: string
}

export interface ItemUpdate {
  content?: string
}
