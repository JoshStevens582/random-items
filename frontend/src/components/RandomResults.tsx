import styles from './RandomResults.module.css'

interface RandomResultsProps {
  tasks: string[]
  visible: boolean
}

export function RandomResults({ tasks, visible }: RandomResultsProps) {
  if (!visible) {
    return null
  }

  return (
    <section className={styles.section} aria-live="polite">
      <div className={styles.inner}>
        <h2 className={styles.title}>Shuffled order</h2>
        <p className={styles.subtitle}>
          Fresh permutation from your collection.
        </p>
        {tasks.length === 0 ? (
          <p className={styles.empty}>
            No tasks yet. Add a few below, then shuffle again.
          </p>
        ) : (
          <ol className={styles.list}>
            {tasks.map((title, index) => (
              <li
                key={`${title}-${index}`}
                className={styles.item}
              >
                <span className={styles.index}>{index + 1}</span>
                <p className={styles.text}>{title}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
