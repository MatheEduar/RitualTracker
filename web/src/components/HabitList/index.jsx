import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { useHabits } from '../../context/HabitsContext'; // Importa o contexto global
import { useDayDetails } from '../../hooks/useDayDetails';
import { habitService } from '../../services/habitService';
import styles from './HabitList.module.css';

export function HabitList({ date }) {
  // 1. Hook que busca os dados iniciais do dia (do backend)
  const { dayInfo, isDayInfoLoading } = useDayDetails(date);
  
  // 2. Estado local para a Interface Otimista (Optimistic UI)
  // Permite que a gente mude o check visualmente sem esperar o backend responder
  const [habitsInfo, setHabitsInfo] = useState(null);

  // 3. Função do Contexto Global para avisar a Tabela de Resumo que algo mudou
  const { refreshSummary } = useHabits();

  // Sincroniza o estado local quando os dados da API chegam
  useEffect(() => {
    if (dayInfo) {
      setHabitsInfo(dayInfo);
    }
  }, [dayInfo]);

  // Função que lida com o clique no Checkbox
  async function handleToggleHabit(habitId) {
    if (!habitsInfo) return;

    // A. Verifica se já está marcado na nossa lista local
    const isHabitAlreadyCompleted = habitsInfo.completedHabits.includes(habitId);

    // B. Cria a nova lista de completados (Conceito de Imutabilidade)
    let completedHabits = [];

    if (isHabitAlreadyCompleted) {
      // Se estava marcado -> Remove da lista
      completedHabits = habitsInfo.completedHabits.filter(id => id !== habitId);
    } else {
      // Se não estava -> Adiciona na lista
      completedHabits = [...habitsInfo.completedHabits, habitId];
    }

    // C. Atualiza a tela IMEDIATAMENTE (O usuário vê o check mudar na hora)
    setHabitsInfo({
      possibleHabits: habitsInfo.possibleHabits,
      completedHabits,
    });

    // D. Chama o backend em background
    // Enviamos a data em formato ISO para garantir que o backend saiba qual dia estamos editando
    await habitService.toggleHabit(habitId, dayjs(date).toISOString());
    
    // E. Avisa a aplicação toda para atualizar o Grid de cores
    // Isso faz o azulejo mudar de cor no fundo sem precisar de F5
    refreshSummary();
  }

  // Estado de Carregamento
  if (isDayInfoLoading || !habitsInfo) {
    return <div style={{ marginTop: '1rem', color: '#a1a1aa' }}>Carregando hábitos...</div>;
  }

  // Regra de Negócio: Podemos bloquear checks no futuro se quisermos
  const isDateInFuture = dayjs(date).endOf('day').isAfter(new Date());
  
  // Por enquanto, deixamos livre (disabled={false}), mas você pode usar isDateInFuture se quiser bloquear
  const isDisabled = false; 

  return (
    <div className={styles.habitList}>
      {habitsInfo.possibleHabits.map(habit => {
        // Verificamos se está completado olhando para o nosso ESTADO LOCAL
        const isCompleted = habitsInfo.completedHabits.includes(habit.id);

        return (
          <Checkbox.Root
            key={habit.id}
            onCheckedChange={() => handleToggleHabit(habit.id)}
            checked={isCompleted}
            disabled={isDisabled}
            className={styles.checkboxRoot}
          >
            {/* O quadrado visual do checkbox */}
            <div className={styles.checkboxIndicatorContainer}>
              <Checkbox.Indicator>
                <Check size={20} className={styles.checkIcon} />
              </Checkbox.Indicator>
            </div>

            {/* O texto do hábito */}
            <span className={styles.habitTitle}>
              {habit.title}
            </span>
          </Checkbox.Root>
        )
      })}
    </div>
  )
}