import styles from './Hero.module.css'

interface HeroProps {
  onShuffle: () => void
  busy: boolean
  error: string | null
}

export function Hero({ onShuffle, busy, error }: HeroProps) {
  return (
    <header className={styles.hero}>
      <div className={styles.heroAtmosphere} aria-hidden="true" />
      <div className={styles.heroInner}>
        <p className={styles.brand}>Random Items</p>
        <p className={styles.tagline}>
          Collect strings. Shuffle them. Keep what matters.
        </p>
        <button
          type="button"
          className={styles.shuffleButton}
          onClick={onShuffle}
          disabled={busy}
        >
          {busy ? 'Shuffling…' : 'Shuffle'}
        </button>
        {error ? <p className={styles.heroError}>{error}</p> : null}
      </div>
    </header>
  )
}
