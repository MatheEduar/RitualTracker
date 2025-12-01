import { useState, useEffect } from "react";
import { habitService } from "../services/habitService";
import dayjs from "dayjs";

export function useDayDetails(date) {
  const [dayInfo, setDayInfo] = useState(null); // Dados que vêm do back
  
  // Vamos carregar os dados toda vez que a data mudar
  useEffect(() => {
    const fetchDayDetails = async () => {
      // Formata a data para ISO string para mandar pro backend
      const dateISO = dayjs(date).toISOString();
      
      try {
        const data = await habitService.getDayDetails(dateISO);
        setDayInfo(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do dia", error);
      }
    };

    fetchDayDetails();
  }, [date]);

  // Retornamos 'completedHabits' e 'possibleHabits' separadinhos para facilitar
  return {
    dayInfo,
    isDayInfoLoading: !dayInfo, // Enquanto for null, está carregando
  };
}