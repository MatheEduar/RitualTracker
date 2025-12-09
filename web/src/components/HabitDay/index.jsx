// src/components/HabitDay/index.jsx

import clsx from 'clsx';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom'; // Importa o componente Link

// Importamos styles, mas não precisamos mais de Dialog, X ou HabitList
import styles from './HabitDay.module.css'; 

export function HabitDay({ amount = 0, completed = 0, date }) {
  const completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0;
  
  // Formato da URL: YYYY-MM-DD
  const dateParam = dayjs(date).format('YYYY-MM-DD');

  return (
    // O QUADRADINHO AGORA É UM LINK
    <Link
      // Define o destino da rota: /day/2025-01-20
      to={`/day/${dateParam}`} 
      
      // Aplicamos o estilo do quadradinho na tag Link
      className={clsx(styles.habitDay, {
        [styles.level1]: completedPercentage > 0 && completedPercentage < 20,
        [styles.level2]: completedPercentage >= 20 && completedPercentage < 40,
        [styles.level3]: completedPercentage >= 40 && completedPercentage < 60,
        [styles.level4]: completedPercentage >= 60 && completedPercentage < 80,
        [styles.level5]: completedPercentage >= 80,
      })}
    />
    // TODO: Certifique-se de ter apagado TODO o código do Dialog.Portal que estava aqui.
  );
}