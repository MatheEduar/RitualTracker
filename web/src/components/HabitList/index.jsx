import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { useHabits } from '../../context/HabitsContext';
import { useDayDetails } from '../../hooks/useDayDetails';
import { habitService } from '../../services/habitService';
import { NotePopover } from '../NotePopover'; // <--- NOVO IMPORT
import { NumericHabit } from '../NumericHabit';
import { ProgressBar } from '../ProgressBar';
import styles from './HabitList.module.css';

export function HabitList({ date }) {
  const { dayInfo, isDayInfoLoading } = useDayDetails(date);
  const [habitsInfo, setHabitsInfo] = useState(null);
  const { refreshSummary } = useHabits();

  useEffect(() => {
    if (dayInfo) {
      setHabitsInfo(dayInfo);
    }
  }, [dayInfo]);

  // --- ATUALIZAÇÃO DA NOTA ---
  function handleNoteUpdate(habitId, newNote) {
    // Atualiza o estado local para que, se reabrir o popover, a nota esteja lá
    const existingRecordIndex = habitsInfo.completedHabits.findIndex(h => h.habit_id === habitId);
    let newCompletedList = [...habitsInfo.completedHabits];

    if (existingRecordIndex >= 0) {
      newCompletedList[existingRecordIndex] = { 
        ...newCompletedList[existingRecordIndex], 
        note: newNote 
      };
    } else {
      // Se criou nota sem marcar o hábito, cria o registro
      newCompletedList.push({ habit_id: habitId, value: 1, note: newNote });
    }

    setHabitsInfo({
      possibleHabits: habitsInfo.possibleHabits,
      completedHabits: newCompletedList,
    });
    
    // Notas também contam como interação, então atualizamos o grid? Opcional.
    refreshSummary();
  }

  // --- LÓGICA NUMÉRICA ---
  function handleNumericUpdate(habitId, newValue) {
    const existingRecordIndex = habitsInfo.completedHabits.findIndex(h => h.habit_id === habitId);
    let newCompletedList = [...habitsInfo.completedHabits];

    if (existingRecordIndex >= 0) {
      newCompletedList[existingRecordIndex] = { 
        ...newCompletedList[existingRecordIndex], 
        value: newValue 
      };
    } else {
      newCompletedList.push({ habit_id: habitId, value: newValue });
    }

    setHabitsInfo({
      possibleHabits: habitsInfo.possibleHabits,
      completedHabits: newCompletedList,
    });
    refreshSummary();
  }

  // --- LÓGICA CHECKBOX ---
  async function handleToggleHabit(habitId) {
    if (!habitsInfo) return;

    const isHabitAlreadyCompleted = habitsInfo.completedHabits.some(h => h.habit_id === habitId);
    let newCompletedList = [];

    if (isHabitAlreadyCompleted) {
      newCompletedList = habitsInfo.completedHabits.filter(h => h.habit_id !== habitId);
    } else {
      newCompletedList = [...habitsInfo.completedHabits, { habit_id: habitId, value: 1 }];
    }

    setHabitsInfo({
      possibleHabits: habitsInfo.possibleHabits,
      completedHabits: newCompletedList,
    });

    await habitService.toggleHabit(habitId, dayjs(date).toISOString());
    refreshSummary();
  }

  if (isDayInfoLoading || !habitsInfo) {
    return <div style={{ marginTop: '1rem', color: '#a1a1aa' }}>Carregando...</div>;
  }

  const possible = habitsInfo.possibleHabits.length;
  const completedCount = habitsInfo.possibleHabits.reduce((acc, habit) => {
    const record = habitsInfo.completedHabits.find(h => h.habit_id === habit.id);
    if (!record) return acc;
    if (habit.goal > 0) return (record.value >= habit.goal) ? acc + 1 : acc;
    return acc + 1;
  }, 0);

  const progress = possible > 0 ? Math.round((completedCount / possible) * 100) : 0;

  return (
    <div className={styles.habitList}>
      <ProgressBar progress={progress} />

      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {habitsInfo.possibleHabits.map(habit => {
          // Busca o registro deste dia (se houver)
          const record = habitsInfo.completedHabits.find(h => h.habit_id === habit.id);
          const currentNote = record ? record.note : '';

          // RENDERIZAÇÃO CONDICIONAL (Numérico vs Checkbox)
          let content;

          if (habit.goal > 0) {
            content = (
              <NumericHabit 
                habit={habit}
                date={dayjs(date).toISOString()}
                initialValue={record ? record.value : 0}
                onUpdate={(val) => handleNumericUpdate(habit.id, val)}
              />
            );
          } else {
            const isCompleted = !!record;
            const habitColor = habit.color || '#8B5CF6';
            content = (
              <Checkbox.Root
                key={habit.id}
                onCheckedChange={() => handleToggleHabit(habit.id)}
                checked={isCompleted}
                className={styles.checkboxRoot}
                style={{ '--habit-color': habitColor }}
              >
                <div className={styles.checkboxIndicatorContainer}>
                  <Checkbox.Indicator>
                    <Check size={20} className={styles.checkIcon} />
                  </Checkbox.Indicator>
                </div>
                <div className={styles.habitTextContainer}>
                  <span className={styles.habitTitle}>{habit.title}</span>
                  {habit.category && <span className={styles.categoryTag}>{habit.category}</span>}
                </div>
              </Checkbox.Root>
            );
          }

          // WRAPPER PARA INCLUIR O POPOVER AO LADO
          // Criamos um container flex para colocar o [Hábito] e o [Lápis] lado a lado
          return (
            <div key={habit.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ flex: 1 }}>
                {content}
              </div>
              
              {/* O ÍCONE DE NOTA */}
              <NotePopover 
                habitId={habit.id} 
                date={dayjs(date).toISOString()} 
                currentNote={currentNote}
                onNoteUpdated={handleNoteUpdate}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}