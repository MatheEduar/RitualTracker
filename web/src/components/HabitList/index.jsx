import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react'; // Importe useState e useEffect
import { habitService } from '../../services/habitService'; // Importe o serviço
import { useDayDetails } from '../../hooks/useDayDetails';
import dayjs from 'dayjs';
import styles from './HabitList.module.css';

export function HabitList({ date }) {
  const { dayInfo, isDayInfoLoading } = useDayDetails(date);
  
  // Estado Local para controlar os checks (Optimistic UI)
  // Começa vazio, mas será preenchido assim que o dayInfo chegar
  const [habitsInfo, setHabitsInfo] = useState(null);

  // Sincroniza o estado local quando os dados da API chegam
  useEffect(() => {
    if (dayInfo) {
      setHabitsInfo(dayInfo);
    }
  }, [dayInfo]);

  // Função que lida com o clique
  async function handleToggleHabit(habitId) {
    // 1. Verifica se já está marcado
    const isHabitAlreadyCompleted = habitsInfo.completedHabits.includes(habitId);

    // 2. Cria a nova lista (Imutabilidade)
    let completedHabits = [];

    if (isHabitAlreadyCompleted) {
      // Se estava marcado, remove da lista (filtra tudo que não for esse ID)
      completedHabits = habitsInfo.completedHabits.filter(id => id !== habitId);
    } else {
      // Se não estava, adiciona na lista
      completedHabits = [...habitsInfo.completedHabits, habitId];
    }

    // 3. Atualiza a tela IMEDIATAMENTE (Optimistic Update)
    setHabitsInfo({
      possibleHabits: habitsInfo.possibleHabits,
      completedHabits,
    });

    // 4. Chama o backend em background
    // Importante: Passamos a data original do dia clicado
    // Convertemos para ISO para viajar seguro no JSON
    await habitService.toggleHabit(habitId, dayjs(date).toISOString());
  }

  // Loading state
  if (isDayInfoLoading || !habitsInfo) {
    return <div style={{ marginTop: '1rem' }}>Carregando hábitos...</div>;
  }

  // Verifica se a data é passada (você não pode editar o passado? Ou pode?)
  // Regra de Negócio: Vamos permitir editar passado, mas não futuro.
  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date());
  
  // Desabilita se for futuro? (Opcional, vamos deixar livre por enquanto)
  const isDisabled = false; 

  return (
    <div className={styles.habitList}>
      {habitsInfo.possibleHabits.map(habit => {
        // Agora olhamos para o nosso ESTADO LOCAL, não direto pro dayInfo
        const isCompleted = habitsInfo.completedHabits.includes(habit.id);

        return (
          <Checkbox.Root
            key={habit.id}
            className={styles.checkboxRoot}
            checked={isCompleted}
            // AQUI LIGAMOS O FIO:
            onCheckedChange={() => handleToggleHabit(habit.id)}
            disabled={isDisabled}
          >
            <div className={styles.checkboxIndicatorContainer}>
              <Checkbox.Indicator>
                <Check size={20} className={styles.checkIcon} />
              </Checkbox.Indicator>
            </div>

            <span className={styles.habitTitle}>
              {habit.title}
            </span>
          </Checkbox.Root>
        )
      })}
    </div>
  )
}