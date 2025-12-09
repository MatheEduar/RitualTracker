// src/components/SummaryTable/index.jsx

import dayjs from "dayjs";
import { generateDatesFromYearBeginning } from "../../utils/generate-dates-from-year-beginning";
import { HabitDay } from "../HabitDay";
// import { GlobalDashboard } from "../GlobalDashboard"; // <-- REMOVIDO
import styles from "./SummaryTable.module.css";
import { useHabits } from "../../context/HabitsContext";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const summaryDates = generateDatesFromYearBeginning();

// Preenche visualmente até ter 18 semanas
const minimumSummaryDatesSize = 18 * 7; 
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

export function SummaryTable() {
  const { summary, isLoading } = useHabits();

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div style={{ padding: '2rem', color: '#71717a' }}>Carregando dados...</div>
      </div>
    );
  }

  return (
    // NOTE: O wrapper original agora só contém o Heatmap (Dias da semana + Grid)
    <div className={styles.wrapper}>
      
      {/* <GlobalDashboard /> REMOVIDO */}

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}> 
          
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
            
            {/* CORREÇÃO 1: ALINHAMENTO DO PRIMEIRO DIA */}
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
    </div>
  )
}