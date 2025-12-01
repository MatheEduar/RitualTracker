import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../../lib/axios";
import { generateDatesFromYearBeginning } from "../../utils/generate-dates-from-year-beginning";
import { HabitDay } from "../HabitDay";
import styles from "./SummaryTable.module.css";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const summaryDates = generateDatesFromYearBeginning();

// Para preencher o buraco visual até completar 18 semanas (opcional, só pra ficar bonito)
const minimumSummaryDatesSize = 18 * 7; 
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

export function SummaryTable() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    api.get('summary').then(response => {
      setSummary(response.data);
    });
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.weekDays}>
        {weekDays.map((weekDay, i) => (
          <div key={`${weekDay}-${i}`} className={styles.weekDay}>
            {weekDay}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {/* Renderiza os dias reais com dados */}
        {summaryDates.map((date) => {
          // Procura no array que veio do backend se tem dados para ESSE dia
          // dayjs(date).isSame... compara ignorando horas/minutos
          const dayInSummary = summary.find(day => {
            return dayjs(date).isSame(day.day_id, 'day')
          });

          return (
            <HabitDay 
              key={date.toString()}
              amount={dayInSummary?.amount} 
              completed={dayInSummary?.completed} 
            />
          )
        })}

        {/* Preenche o resto do grid com quadradinhos vazios para não ficar buraco */}
        {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => {
          return (
            <div key={i} className={styles.habitDayPlaceholder} />
          )
        })}
      </div>
    </div>
  )
}