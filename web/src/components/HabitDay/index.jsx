// src/components/HabitDay/index.jsx
import clsx from 'clsx';
import styles from './HabitDay.module.css';

export function HabitDay({ amount = 0, completed = 0 }) {
  // Cálculo da porcentagem (com proteção contra divisão por zero)
  const completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0;

  return (
    <div
      className={clsx(styles.habitDay, {
        [styles.level1]: completedPercentage > 0 && completedPercentage < 20,
        [styles.level2]: completedPercentage >= 20 && completedPercentage < 40,
        [styles.level3]: completedPercentage >= 40 && completedPercentage < 60,
        [styles.level4]: completedPercentage >= 60 && completedPercentage < 80,
        [styles.level5]: completedPercentage >= 80,
      })}
    />
  );
}