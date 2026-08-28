import styles from './DashboardStats.module.css'

interface DashboardStatsProps {
  total: number
  todo: number
  inProgress: number
  done: number
}

export function DashboardStats({ total, todo, inProgress, done }: DashboardStatsProps) {
  return (
    <div className={styles.statsContainer}>
      <div className={styles.statCard}>
        <span className={styles.statLabel}>Total</span>
        <span className={styles.statValue}>{total}</span>
      </div>
      <div className={`${styles.statCard} ${styles.statTodo}`}>
        <span className={styles.statLabel}>To Do</span>
        <span className={styles.statValue}>{todo}</span>
      </div>
      <div className={`${styles.statCard} ${styles.statInProgress}`}>
        <span className={styles.statLabel}>In Progress</span>
        <span className={styles.statValue}>{inProgress}</span>
      </div>
      <div className={`${styles.statCard} ${styles.statDone}`}>
        <span className={styles.statLabel}>Done</span>
        <span className={styles.statValue}>{done}</span>
      </div>
    </div>
  )
}
