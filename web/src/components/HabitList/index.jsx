import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { useDayDetails } from '../../hooks/useDayDetails';
import styles from './HabitList.module.css';

export function HabitList({ date }) {
  // 1. Usamos o Controller para buscar os dados
  const { dayInfo, isDayInfoLoading } = useDayDetails(date);

  // Enquanto carrega, podemos mostrar um esqueleto ou apenas null
  if (isDayInfoLoading) {
    return <div style={{ marginTop: '1rem' }}>Carregando hábitos...</div>;
  }

  return (
    <div className={styles.habitList}>
      {dayInfo?.possibleHabits.map(habit => {
        // Verifica se este hábito específico está na lista de completados
        const isCompleted = dayInfo.completedHabits.includes(habit.id);

        return (
          <Checkbox.Root
            key={habit.id}
            className={styles.checkboxRoot}
            checked={isCompleted}
            // onCheckedChange={() => handleToggle(habit.id)} // Faremos a ação de clicar no próximo passo
            disabled={true} // Vamos deixar desabilitado só por enquanto até fazermos a ação de toggle
          >
            {/* O quadrado visual */}
            <div className={styles.checkboxIndicatorContainer}>
              <Checkbox.Indicator>
                <Check size={20} className={styles.checkIcon} />
              </Checkbox.Indicator>
            </div>

            {/* O texto */}
            <span className={styles.habitTitle}>
              {habit.title}
            </span>
          </Checkbox.Root>
        )
      })}
    </div>
  )
}