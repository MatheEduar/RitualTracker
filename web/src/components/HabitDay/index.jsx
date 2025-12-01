// src/components/HabitDay/index.jsx
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { X } from 'phosphor-react';
import { HabitList } from '../HabitList';
import styles from './HabitDay.module.css';

export function HabitDay({ amount = 0, completed = 0, date }) {
  // Cálculo da porcentagem
  const completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0;

  // CORREÇÃO 3: TÍTULO DO MODAL 📅
  // Adicionamos 12 horas à data local. 
  // Se ela for 00:00, vira 12:00. Se o fuso tirar 3h, vira 09:00.
  // Em ambos os casos, CONTINUA SENDO O MESMO DIA.
  const parsedDate = dayjs(date).add(12, 'hours');

  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={clsx(styles.habitDay, {
          [styles.level1]: completedPercentage > 0 && completedPercentage < 20,
          [styles.level2]: completedPercentage >= 20 && completedPercentage < 40,
          [styles.level3]: completedPercentage >= 40 && completedPercentage < 60,
          [styles.level4]: completedPercentage >= 60 && completedPercentage < 80,
          [styles.level5]: completedPercentage >= 80,
        })}
      />

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content className={styles.content}>
          <Dialog.Close className={styles.closeButton}>
            <X size={24} aria-label="Fechar" />
          </Dialog.Close>

          <span className={styles.dayLabel}>{dayOfWeek}</span>
          <h1 className={styles.dateTitle}>{dayAndMonth}</h1>

          <HabitList date={date} />
          
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}