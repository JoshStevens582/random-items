import styles from './RandomResults.module.css'

interface RandomResultsProps {
  items: string[]
  visible: boolean
}

export function RandomResults({ items, visible }: RandomResultsProps) {
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
        {items.length === 0 ? (
          <p className={styles.empty}>
            No items yet. Add a few below, then shuffle again.
          </p>
        ) : (
          <ol className={styles.list}>
            {items.map((content, index) => (
              <li
                key={`${content}-${index}`}
                className={styles.item}
              >
                <span className={styles.index}>{index + 1}</span>
                <p className={styles.text}>{content}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
