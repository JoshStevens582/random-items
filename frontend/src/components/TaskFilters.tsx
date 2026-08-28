import type { TaskPriority, TaskSortBy, TaskSortOrder, TaskStatus } from '../types'
import styles from './TaskFilters.module.css'

interface TaskFiltersProps {
  status: TaskStatus | 'all'
  priority: TaskPriority | 'all'
  sortBy: TaskSortBy
  sortOrder: TaskSortOrder
  onStatusChange: (status: TaskStatus | 'all') => void
  onPriorityChange: (priority: TaskPriority | 'all') => void
  onSortByChange: (sortBy: TaskSortBy) => void
  onSortOrderToggle: () => void
  onReset: () => void
  hasActiveFilters: boolean
}

export function TaskFilters({
  status,
  priority,
  sortBy,
  sortOrder,
  onStatusChange,
  onPriorityChange,
  onSortByChange,
  onSortOrderToggle,
  onReset,
  hasActiveFilters,
}: TaskFiltersProps) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-status">
          Status
        </label>
        <select
          id="filter-status"
          className={styles.select}
          value={status}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'all')}
        >
          <option value="all">All statuses</option>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-priority">
          Priority
        </label>
        <select
          id="filter-priority"
          className={styles.select}
          value={priority}
          onChange={(e) =>
            onPriorityChange(e.target.value as TaskPriority | 'all')
          }
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="filter-sort">
          Sort by
        </label>
        <select
          id="filter-sort"
          className={styles.select}
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as TaskSortBy)}
        >
          <option value="created_at">Date created</option>
          <option value="due_date">Due date</option>
          <option value="priority">Priority</option>
          <option value="id">Task ID</option>
        </select>
      </div>

      <div className={styles.actionGroup}>
        <button
          type="button"
          className={styles.orderButton}
          onClick={onSortOrderToggle}
          title={`Currently ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
        >
          {sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>

        {hasActiveFilters ? (
          <button
            type="button"
            className={styles.resetButton}
            onClick={onReset}
          >
            Reset
          </button>
        ) : null}
      </div>
    </div>
  )
}
