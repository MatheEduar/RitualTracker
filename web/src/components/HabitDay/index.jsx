// src/components/HabitDay/index.jsx
import * as Dialog from '@radix-ui/react-dialog'; // Importamos a biblioteca
import clsx from 'clsx';
import dayjs from 'dayjs';
import { X } from 'phosphor-react'; // Ícone de fechar
import styles from './HabitDay.module.css';

// Recebemos a prop 'date' agora
export function HabitDay({ amount = 0, completed = 0, date }) {
  const completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0;

  // Formatações de data
  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format('dddd'); // ex: Domingo
  const dayAndMonth = parsedDate.format('DD/MM'); // ex: 05/01

  return (
    <Dialog.Root>
      {/* O Trigger é o botão que abre o modal (nosso quadradinho antigo) */}
      <Dialog.Trigger
        className={clsx(styles.habitDay, {
          [styles.level1]: completedPercentage > 0 && completedPercentage < 20,
          [styles.level2]: completedPercentage >= 20 && completedPercentage < 40,
          [styles.level3]: completedPercentage >= 40 && completedPercentage < 60,
          [styles.level4]: completedPercentage >= 60 && completedPercentage < 80,
          [styles.level5]: completedPercentage >= 80,
        })}
      />

      {/* O Portal joga o modal para fora da árvore DOM (no final do body) para evitar bugs de z-index */}
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content className={styles.content}>
          <Dialog.Close className={styles.closeButton}>
            <X size={24} aria-label="Fechar" />
          </Dialog.Close>

          <span className={styles.dayLabel}>{dayOfWeek}</span>
          <h1 className={styles.dateTitle}>{dayAndMonth}</h1>

          {/* AQUI VIRÁ A LISTA DE HÁBITOS (Próximo passo) */}
          <p>Lista de hábitos virá aqui...</p>
          
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}