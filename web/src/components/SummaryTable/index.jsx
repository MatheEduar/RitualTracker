// src/components/SummaryTable/index.jsx
import dayjs from "dayjs";
import { useSummary } from "../../hooks/useSummary";
import { generateDatesFromYearBeginning } from "../../utils/generate-dates-from-year-beginning";
import { HabitDay } from "../HabitDay";
import styles from "./SummaryTable.module.css";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const summaryDates = generateDatesFromYearBeginning();

// Preenche visualmente até ter 18 semanas
const minimumSummaryDatesSize = 18 * 7; 
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

export function SummaryTable() {
  const { summary, isLoading } = useSummary();

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div style={{ padding: '2rem', color: '#71717a' }}>Carregando dados...</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Cabeçalho dos dias da semana */}
      <div className={styles.weekDays}>
        {weekDays.map((weekDay, i) => (
          <div key={`${weekDay}-${i}`} className={styles.weekDay}>
            {weekDay}
          </div>
        ))}
      </div>

      {/* Grid de Dias */}
      <div className={styles.grid}>
        
        {/* CORREÇÃO 1: ALINHAMENTO DO PRIMEIRO DIA
           Se o ano começa na Quarta (3), cria 3 blocos invisíveis antes.
        */}
        {summaryDates.length > 0 && Array.from({ length: dayjs(summaryDates[0]).get('day') }).map((_, i) => {
          return (
            <div 
              key={`empty-${i}`} 
              className={styles.habitDayPlaceholder} 
              style={{ opacity: 0, cursor: 'default', border: 'none' }} 
            />
          )
        })}

        {/* DIAS REAIS */}
        {summaryDates.map((date) => {
          // CORREÇÃO 2: COMPARAR MAÇÃ COM MAÇÃ 🍎
          // 'date' é local (00:00 BRT). 'day.day_id' é UTC (00:00 Z).
          // Usamos .utc() no dado do banco para garantir que lemos a data original.
          // Comparamos as strings "YYYY-MM-DD" para ignorar horas.
          
          const dayInSummary = summary.find(day => {
            return dayjs(date).format('YYYY-MM-DD') === dayjs(day.day_id).utc().format('YYYY-MM-DD')
          });

          return (
            <HabitDay 
              key={date.toString()}
              date={date}
              amount={dayInSummary?.amount} 
              completed={dayInSummary?.completed} 
            />
          )
        })}

        {/* PLACEHOLDERS FUTUROS */}
        {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => {
          return (
            <div key={i} className={styles.habitDayPlaceholder} />
          )
        })}
      </div>
    </div>
  )
}