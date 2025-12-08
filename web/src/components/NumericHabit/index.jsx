import { Minus, Plus } from 'phosphor-react';
import { useState } from 'react';
import { habitService } from '../../services/habitService';
import styles from './NumericHabit.module.css';

export function NumericHabit({ habit, initialValue, date, onUpdate }) {
  const [value, setValue] = useState(initialValue || 0);

  async function updateDatabase(newValue) {
    // 1. UI Otimista: Atualiza o input imediatamente para o usuário não sentir lag
    setValue(newValue);

    // 2. Chama o Backend e ESPERA terminar (Await)
    // Isso garante que o valor 0 foi salvo no banco antes de pedirmos o resumo novo
    await habitService.updateValue(habit.id, date, newValue);
    
    // 3. Só agora avisamos o Pai para atualizar o Grid
    if (onUpdate) {
      onUpdate(newValue);
    }
  }

  function increment() {
    updateDatabase(value + 1);
  }

  function decrement() {
    if (value > 0) updateDatabase(value - 1);
  }

  function handleChange(e) {
    const inputVal = e.target.value;
    const newVal = inputVal === '' ? 0 : parseInt(inputVal);
    updateDatabase(newVal);
  }

  const color = habit.color || '#8B5CF6';
  const isCompleted = value >= habit.goal; 

  const percentage = habit.goal > 0 
    ? Math.min(100, Math.round((value / habit.goal) * 100)) 
    : 0;

  return (
    <div 
      className={styles.container} 
      style={{ 
        '--habit-color': color,
        borderColor: isCompleted ? 'var(--habit-color)' : 'var(--border)'
      }}
    >
      <div className={styles.header}>
        <span className={styles.title}>{habit.title}</span>
        <span className={styles.meta} style={{ color: isCompleted ? 'var(--habit-color)' : 'var(--text-secondary)' }}>
          {value} / {habit.goal} {habit.unit}
        </span>
      </div>

      <div className={styles.controls}>
        <button className={styles.btn} onClick={decrement} type="button">
          <Minus size={16} />
        </button>
        
        <input 
          type="number" 
          className={styles.input} 
          value={value} 
          onChange={handleChange}
        />

        <button className={styles.btn} onClick={increment} type="button">
          <Plus size={16} />
        </button>
      </div>

      <div className={styles.miniProgressTrack}>
        <div 
          className={styles.miniProgressIndicator} 
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}