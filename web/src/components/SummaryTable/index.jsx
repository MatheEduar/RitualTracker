import { HabitDay } from "../HabitDay";
import styles from "./SummaryTable.module.css";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// Vamos criar um array de tamanho arbitrário (ex: 18 semanas * 7 dias = 126 dias)
// Só para encher linguiça visualmente por enquanto.
const summaryDates = Array.from({ length: 18 * 7 });

export function SummaryTable() {
  return (
    <div className={styles.wrapper}>
      {/* Coluna dos Dias da Semana */}
      <div className={styles.weekDays}>
        {weekDays.map((weekDay, i) => {
          return (
            <div key={`${weekDay}-${i}`} className={styles.weekDay}>
              {weekDay}
            </div>
          )
        })}
      </div>

      {/* A Grade de Dias */}
      <div className={styles.grid}>
        {summaryDates.map((_, i) => {
          return (
            <HabitDay key={i} />
          )
        })}
      </div>
    </div>
  )
}