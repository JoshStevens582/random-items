import styles from './Hero.module.css'

export function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroAtmosphere} aria-hidden="true" />
      <div className={styles.heroInner}>
        <h1 className={styles.brand}>Task Manager</h1>
        <p className={styles.tagline}>
          Organize, prioritize, and track your tasks.
        </p>
      </div>
    </header>
  )
}
