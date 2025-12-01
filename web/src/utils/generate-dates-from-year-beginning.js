// src/utils/generate-dates-from-year-beginning.js
import dayjs from "dayjs";
// Vamos precisar do dayjs para lidar com datas (ele é mais leve que o moment)
// Se der erro, rode 'npm install dayjs' na pasta web

export function generateDatesFromYearBeginning() {
  const firstDayOfTheYear = dayjs().startOf('year');
  const today = new Date();

  const dates = [];
  let compareDate = firstDayOfTheYear;

  while (compareDate.isBefore(today)) {
    dates.push(compareDate.toDate());
    compareDate = compareDate.add(1, 'day');
  }

  return dates;
}