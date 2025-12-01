import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { useHabits } from '../../context/HabitsContext';
import { useDayDetails } from '../../hooks/useDayDetails';
import { habitService } from '../../services/habitService';
import { ProgressBar } from '../ProgressBar'; // Certifique-se de ter criado este componente
import styles from './HabitList.module.css';

/**
 * Componente responsável por exibir a lista de hábitos de um dia específico.
 * Gerencia a marcação/desmarcação (Toggle) com feedback visual instantâneo (Optimistic UI).
 *
 * @param {Object} props - As propriedades do componente.
 * @param {Date} props.date - A data selecionada que será inspecionada.
 */
export function HabitList({ date }) {
  // 1. Hook que busca os dados iniciais do dia no Backend
  const { dayInfo, isDayInfoLoading } = useDayDetails(date);

  // 2. Estado local para a Interface Otimista.
  // Armazena uma cópia dos dados para podermos manipular visualmente antes do backend responder.
  const [habitsInfo, setHabitsInfo] = useState(null);

  // 3. Hook do Contexto Global para disparar atualizações no Grid de Resumo (Heatmap)
  const { refreshSummary } = useHabits();

  /**
   * Efeito: Sincronização Inicial
   * Quando os dados chegam da API (dayInfo), atualizamos nosso estado local.
   */
  useEffect(() => {
    if (dayInfo) {
      setHabitsInfo(dayInfo);
    }
  }, [dayInfo]);

  /**
   * Lida com a ação de marcar ou desmarcar um hábito.
   * Executa uma atualização otimista (Optimistic Update).
   *
   * @param {string} habitId - O UUID do hábito que foi clicado.
   */
  async function handleToggleHabit(habitId) {
    if (!habitsInfo) return;

    // Verifica se o hábito já estava na lista de completados localmente
    const isHabitAlreadyCompleted = habitsInfo.completedHabits.includes(habitId);

    // Cria uma nova lista de IDs baseada na ação (Adicionar ou Remover)
    let completedHabits = [];

    if (isHabitAlreadyCompleted) {
      // Remover da lista
      completedHabits = habitsInfo.completedHabits.filter(id => id !== habitId);
    } else {
      // Adicionar na lista
      completedHabits = [...habitsInfo.completedHabits, habitId];
    }

    // A. ATUALIZAÇÃO VISUAL IMEDIATA (Optimistic UI)
    // O usuário vê o check mudar de cor instantaneamente.
    setHabitsInfo({
      possibleHabits: habitsInfo.possibleHabits,
      completedHabits,
    });

    // B. PERSISTÊNCIA NO BACKEND
    // Envia a requisição em background. Usamos .toISOString() para garantir o formato correto da data.
    await habitService.toggleHabit(habitId, dayjs(date).toISOString());

    // C. SINCRONIZAÇÃO GLOBAL
    // Avisa o componente SummaryTable (que está no fundo) para recalcular as cores dos dias.
    refreshSummary();
  }

  // Estado de Carregamento Inicial
  if (isDayInfoLoading || !habitsInfo) {
    return <div style={{ marginTop: '1rem', color: '#a1a1aa' }}>Carregando hábitos...</div>;
  }

  // Cálculo da Porcentagem para a Barra de Progresso
  const possible = habitsInfo.possibleHabits.length;
  const completed = habitsInfo.completedHabits.length;
  // Previne divisão por zero (NaN)
  const progress = possible > 0 ? Math.round((completed / possible) * 100) : 0;

  // Regra de Negócio (Opcional): Bloquear edição em dias futuros?
  // const isDateInFuture = dayjs(date).endOf('day').isAfter(new Date());
  const isDisabled = false;

  return (
    <div className={styles.habitList}>
      {/* Barra de Progresso no topo da lista */}
      <ProgressBar progress={progress} />

      {/* Container dos Checkboxes */}
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {habitsInfo.possibleHabits.map(habit => {
          // Verifica o estado usando a variável local (otimista)
          const isCompleted = habitsInfo.completedHabits.includes(habit.id);

          return (
            <Checkbox.Root
              key={habit.id}
              onCheckedChange={() => handleToggleHabit(habit.id)}
              checked={isCompleted}
              disabled={isDisabled}
              className={styles.checkboxRoot}
            >
              {/* O quadrado visual do checkbox (Radix UI) */}
              <div className={styles.checkboxIndicatorContainer}>
                <Checkbox.Indicator>
                  <Check size={20} className={styles.checkIcon} />
                </Checkbox.Indicator>
              </div>

              {/* Título do Hábito */}
              <span className={styles.habitTitle}>
                {habit.title}
              </span>
            </Checkbox.Root>
          )
        })}
      </div>
    </div>
  )
}