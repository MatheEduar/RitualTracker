import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from "phosphor-react";
import { useState } from "react";
import { api } from "../../lib/axios";
import styles from "./NewHabitForm.module.css";

const availableWeekDays = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
];

export function NewHabitForm({ onClose }) { // Recebe onClose para fechar o modal
  const [title, setTitle] = useState('');
  const [weekDays, setWeekDays] = useState([]); // Array de índices [0, 2, 5]

  async function createNewHabit(event) {
    event.preventDefault(); // Não recarrega a página

    if (!title || weekDays.length === 0) {
      return; // Validação básica
    }

    // Chama o Backend
    await api.post('habits', {
      title,
      weekDays,
    });

    // Limpa o form
    setTitle('');
    setWeekDays([]);
    alert('Hábito criado com sucesso!'); // Feedback simples
    onClose(); // Fecha o modal
    // Idealmente, aqui chamaríamos o refreshSummary() do contexto se fosse afetar o passado
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

      <label htmlFor="" className={styles.label} style={{ marginTop: '1rem' }}>
        Qual a recorrência?
      </label>

      <div className={styles.weekDaySelector}>
        {availableWeekDays.map((weekDay, index) => (
          <button
            key={weekDay}
            type="button"
            className={styles.weekDayButton}
            // Truque visual: Mudamos o estilo baseado se está no array ou não
            data-state={weekDays.includes(index) ? 'checked' : 'unchecked'}
            onClick={() => handleToggleWeekDay(index)}
            title={weekDay}
          >
            {weekDay[0]} {/* Apenas a primeira letra (D, S, T...) */}
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