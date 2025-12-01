import styles from './ProgressBar.module.css';

export function ProgressBar({ progress }) {
  return (
    <div className={styles.container}>
      {/* Mostra a porcentagem em texto */}
      <span className={styles.label}>
        {progress}%
      </span>

      {/* A Barra Visual */}
      <div 
        className={styles.progressTrack}
        role="progressbar"
        aria-label="Progresso de hábitos completados nesse dia"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div 
          className={styles.progressIndicator}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}