// src/components/EditHabitForm/index.jsx

import * as Dialog from '@radix-ui/react-dialog';
import { Check, X } from "phosphor-react";
import { useState } from "react";
import { toast } from 'sonner';
import { habitService } from "../../services/habitService";
import { useHabits } from '../../context/HabitsContext';
import styles from "./EditHabitForm.module.css"; 

// Replicando as constantes do NewHabitForm para auto-suficiência
const availableWeekDays = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
];
const availableColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef',
];
const availableCategories = [
  'Saúde', 'Trabalho', 'Estudo', 'Espiritual', 'Lazer', 'Financeiro', 'Geral'
];


/**
 * Formulário para editar as configurações de um hábito existente.
 * @param {Object} props
 * @param {Object} props.habit - O objeto do hábito a ser editado.
 * @param {Function} props.onClose - Função para fechar o modal.
 * @param {Function} props.onSuccess - Callback após salvar com sucesso.
 */
export function EditHabitForm({ habit, onClose, onSuccess }) {
  const [title, setTitle] = useState(habit.title || '');
  // A recorrência é um array de objetos, transformamos em array de índices para o estado
  const initialWeekDays = habit.weekDays ? habit.weekDays.map(wd => wd.week_day) : [];
  const [weekDays, setWeekDays] = useState(initialWeekDays);
  
  const [category, setCategory] = useState(habit.category || 'Geral');
  const [color, setColor] = useState(habit.color || '#8B5CF6');

  // --- Estados Numéricos ---
  const isHabitNumeric = habit.goal > 0;
  const [isNumeric, setIsNumeric] = useState(isHabitNumeric);
  const [goal, setGoal] = useState(habit.goal > 0 ? String(habit.goal) : '');
  const [unit, setUnit] = useState(habit.unit || '');

  // Pega a função de atualização global do grid (Heatmap)
  const { refreshSummary } = useHabits();


  async function handleUpdateHabit(event) {
    event.preventDefault();

    if (!title) {
      toast.warning('O título é obrigatório!');
      return; 
    }
    
    // Converte goal para número, garantindo 0 se não for numérico
    const goalValue = isNumeric ? (parseInt(goal) || 0) : 0;
    
    // Se for numérico e a meta for 0, dá aviso (só se for maior que 0)
    if (isNumeric && goalValue <= 0) {
        toast.warning("Para hábitos numéricos, a meta deve ser maior que zero!");
        return;
    }

    try {
        const updateData = {
            title,
            weekDays,
            category,
            color,
            goal: goalValue,
            unit: isNumeric ? unit : null,
        };

        await habitService.updateHabit(habit.id, updateData);
        
        toast.success(`Hábito "${title}" atualizado com sucesso!`);
        
        // Dispara a atualização do grid (Heatmap)
        refreshSummary();
        
        // Executa callback para atualizar a lista na página de Configurações
        onSuccess();
        onClose();

    } catch (error) {
        console.error(error);
        toast.error('Erro ao atualizar hábito. Tente novamente.');
    }
  }

  function handleToggleWeekDay(weekDayIndex) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays(prevState => prevState.filter(day => day !== weekDayIndex));
    } else {
      setWeekDays(prevState => [...prevState, weekDayIndex].sort((a, b) => a - b));
    }
  }

  return (
    <form onSubmit={handleUpdateHabit} className={styles.form}>
      
      {/* 1. TÍTULO */}
      <label htmlFor="title" className={styles.label}>Título</label>
      <input
        type="text"
        id="title"
        className={styles.input}
        value={title}
        onChange={event => setTitle(event.target.value)}
      />

      {/* 2. CATEGORIA */}
      <label className={styles.label}>Categoria</label>
      <div className={styles.categoryGrid}>
        {availableCategories.map(cat => (
          <button
            key={cat}
            type="button"
            className={styles.categoryButton}
            data-state={category === cat ? 'checked' : 'unchecked'}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. COR */}
      <label className={styles.label}>Cor do Hábito</label>
      <div className={styles.colorsGrid}>
        {availableColors.map(c => (
          <button
            key={c}
            type="button"
            className={styles.colorButton}
            style={{ backgroundColor: c }}
            data-state={color === c ? 'checked' : 'unchecked'}
            onClick={() => setColor(c)}
          />
        ))}
      </div>

      {/* 4. META NUMÉRICA */}
      <div className={styles.numericToggleContainer}>
        <input 
          type="checkbox" 
          id="isNumericEdit" 
          checked={isNumeric} 
          onChange={(e) => setIsNumeric(e.target.checked)}
          className={styles.checkbox}
        />
        <label htmlFor="isNumericEdit" className={styles.checkboxLabel}>
          Este é um hábito numérico?
        </label>
      </div>

      {isNumeric && (
        <div className={styles.row}>
          <div style={{ flex: 1 }}>
            <label htmlFor="goal" className={styles.label}>Meta Diária</label>
            <input
              type="number"
              id="goal"
              className={styles.input}
              value={goal}
              onChange={event => setGoal(event.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="unit" className={styles.label}>Unidade</label>
            <input
              type="text"
              id="unit"
              className={styles.input}
              value={unit}
              onChange={event => setUnit(event.target.value)}
            />
          </div>
        </div>
      )}

      {/* 5. RECORRÊNCIA */}
      <label className={styles.label}>Recorrência</label>
      <div className={styles.weekDaySelector}>
        {availableWeekDays.map((weekDay, index) => (
          <button
            key={weekDay}
            type="button"
            className={styles.weekDayButton}
            data-state={weekDays.includes(index) ? 'checked' : 'unchecked'}
            onClick={() => handleToggleWeekDay(index)}
          >
            {weekDay[0]}
          </button>
        ))}
      </div>

      <button type="submit" className={styles.submitButton}>
        <Check size={20} weight="bold" />
        Salvar Alterações
      </button>
    </form>
  )
}