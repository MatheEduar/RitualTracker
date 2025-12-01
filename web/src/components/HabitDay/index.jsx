import styles from './HabitDay.module.css';

// Por enquanto, ele é estático. Depois receberá props para mudar de cor.
export function HabitDay() {
  return (
    <div className={styles.habitDay} />
  )
}