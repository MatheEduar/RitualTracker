import dayjs from "dayjs";
import { generateDatesFromYearBeginning } from "../../utils/generate-dates-from-year-beginning";
import { HabitDay } from "../HabitDay";
import { useSummary } from "../../hooks/useSummary"; // Importa nosso "Controller"
import styles from "./SummaryTable.module.css";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const summaryDates = generateDatesFromYearBeginning();
const minimumSummaryDatesSize = 18 * 7; 
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

export function SummaryTable() {
  // A Lógica complexa foi delegada para o hook
  const { summary, isLoading } = useSummary();

  if (isLoading) {
    return <div className={styles.loading}>Carregando...</div>; // (Opcional: Crie estilo para isso depois)
  }

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
        {summaryDates.map((date) => {
          const dayInSummary = summary.find(day => {
            return dayjs(date).isSame(day.day_id, 'day')
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

        {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => {
          return (
            <div key={i} className={styles.habitDayPlaceholder} />
          )
        })}
      </div>
    </div>
  )
}