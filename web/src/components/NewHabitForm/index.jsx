import { Check } from "phosphor-react";
import { useState } from "react";
import { toast } from 'sonner'; // <--- O Carteiro das Notificações
import { api } from "../../lib/axios";
import styles from "./NewHabitForm.module.css";

const availableWeekDays = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
];

const availableColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef',
];

const availableCategories = [
  'Saúde', 'Trabalho', 'Estudo', 'Espiritual', 'Lazer', 'Financeiro'
];

/**
 * Formulário de criação de hábitos.
 * Integrado com Backend, Estilos Visuais e Feedback via Toast.
 */
export function NewHabitForm({ onClose }) {
  const [title, setTitle] = useState('');
  const [weekDays, setWeekDays] = useState([]);
  
  const [category, setCategory] = useState('Saúde');
  const [color, setColor] = useState('#8B5CF6');

  const [isNumeric, setIsNumeric] = useState(false);
  const [goal, setGoal] = useState('');
  const [unit, setUnit] = useState('');

  async function createNewHabit(event) {
    event.preventDefault();

    if (!title || weekDays.length === 0) {
      toast.warning('Informe o título e a recorrência!');
      return; 
    }

    if (isNumeric && !goal) {
      toast.warning("Para hábitos numéricos, defina uma meta!");
      return;
    }

    try {
      await api.post('habits', {
        title,
        weekDays,
        category,
        color,
        goal: isNumeric ? parseInt(goal) : 0,
        unit: isNumeric ? unit : null,
      });

      // Limpeza do Form
      setTitle('');
      setWeekDays([]);
      setCategory('Saúde');
      setColor('#8B5CF6');
      setIsNumeric(false);
      setGoal('');
      setUnit('');
      
      // Feedback Elegante 🥂
      toast.success('Hábito criado com sucesso!');
      
      onClose(); // Fecha o modal
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar hábito. Tente novamente.');
    }
  }

  function handleToggleWeekDay(weekDayIndex) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays(prevState => prevState.filter(day => day !== weekDayIndex));
    } else {
      setWeekDays(prevState => [...prevState, weekDayIndex]);
    }
  }

  return (
    <form onSubmit={createNewHabit} className={styles.form}>
      
      {/* 1. TÍTULO */}
      <label htmlFor="title" className={styles.label}>
        Qual seu comprometimento?
      </label>
      <input
        type="text"
        id="title"
        placeholder="ex.: Exercícios, dormir bem, etc..."
        className={styles.input}
        autoFocus
        value={title}
        onChange={event => setTitle(event.target.value)}
      />

      {/* 2. CATEGORIA */}
      <label className={styles.label} style={{ marginTop: '1rem' }}>
        Categoria
      </label>
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
      <label className={styles.label} style={{ marginTop: '1rem' }}>
        Cor do Hábito
      </label>
      <div className={styles.colorsGrid}>
        {availableColors.map(c => (
          <button
            key={c}
            type="button"
            className={styles.colorButton}
            style={{ backgroundColor: c }}
            data-state={color === c ? 'checked' : 'unchecked'}
            onClick={() => setColor(c)}
            title={c}
          />
        ))}
      </div>

      {/* 4. META NUMÉRICA (Toggle) */}
      <div className={styles.numericToggleContainer}>
        <input 
          type="checkbox" 
          id="isNumeric" 
          checked={isNumeric} 
          onChange={(e) => setIsNumeric(e.target.checked)}
          className={styles.checkbox}
        />
        <label htmlFor="isNumeric" className={styles.checkboxLabel}>
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
              placeholder="Ex: 2000"
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
              placeholder="Ex: ml, km"
              className={styles.input}
              value={unit}
              onChange={event => setUnit(event.target.value)}
            />
          </div>
        </div>
      )}

      {/* 5. RECORRÊNCIA */}
      <label htmlFor="" className={styles.label} style={{ marginTop: '1rem' }}>
        Qual a recorrência?
      </label>
      <div className={styles.weekDaySelector}>
        {availableWeekDays.map((weekDay, index) => (
          <button
            key={weekDay}
            type="button"
            className={styles.weekDayButton}
            data-state={weekDays.includes(index) ? 'checked' : 'unchecked'}
            onClick={() => handleToggleWeekDay(index)}
            title={weekDay}
          >
            {weekDay[0]}
          </button>
        ))}
      </div>

      <button type="submit" className={styles.submitButton}>
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  )
}