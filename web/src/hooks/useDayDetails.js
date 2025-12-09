import { useState, useEffect } from "react";
import { habitService } from "../services/habitService";
import dayjs from "dayjs";

/**
 * Processa os dados brutos do backend (DayHabit e Habit) em categorias e métricas de análise.
 * @param {Array} possibleHabits - Lista de hábitos que podem ser feitos no dia.
 * @param {Array} completedHabits - Lista de registros de execução do dia.
 * @returns {{categories: Object, analytics: Object}} Dados estruturados.
 */
const categorizeHabits = (possibleHabits, completedHabits) => {
  const categories = {
    Treino: [],
    Dieta: [],
    Geral: [],
    Outros: [],
  };

  possibleHabits.forEach(habit => {
    // Encontra o registro de execução (value, note)
    const record = completedHabits.find(h => h.habit_id === habit.id);
    const progress = record ? record.value : 0;
    const note = record ? record.note : '';
    
    // Calcula o status de conclusão para facilitar
    const isCompleted = habit.goal > 0 ? progress >= habit.goal : progress > 0;

    const habitData = {
      ...habit,
      progress,
      note,
      isCompleted
    };

    const categoryKey = habit.category || 'Geral';
    
    // Agrupa (Note que Dieta/Treino/Geral/Outros são as chaves padrão)
    if (categories[categoryKey]) {
      categories[categoryKey].push(habitData);
    } else {
      categories.Outros.push(habitData);
    }
  });

  // --- CÁLCULO DE MÉTRICAS (Simulação de Analytics) ---
  
  // 1. Total de Água (Filtrando hábitos que usam 'ml' na unidade)
  const waterHabits = categories.Dieta.filter(h => h.unit && h.unit.toLowerCase().includes('ml'));
  const totalWaterIntake = waterHabits.reduce((sum, h) => sum + h.progress, 0);

  // 2. Porcentagem de Conclusão do Treino
  const completedTraining = categories.Treino.filter(h => h.isCompleted).length;
  const totalTraining = categories.Treino.length;

  return {
    categories,
    analytics: {
      totalWaterIntake,
      completedTraining,
      totalTraining,
    },
  };
};

export function useDayDetails(date) {
  const [dayInfo, setDayInfo] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null); // <--- NOVO ESTADO
  
  useEffect(() => {
    const fetchDayDetails = async () => {
      const dateISO = dayjs(date).toISOString();
      
      try {
        const data = await habitService.getDayDetails(dateISO);
        setDayInfo(data);
        
        // Processa os dados para a dashboard
        const processed = categorizeHabits(data.possibleHabits, data.completedHabits);
        setAnalyticsData(processed); // <--- Salva os dados processados

      } catch (error) {
        console.error("Erro ao buscar detalhes do dia", error);
        setAnalyticsData(null);
      }
    };

    fetchDayDetails();
  }, [date]);

  return {
    dayInfo,
    analyticsData, // <--- Novo objeto com dados categorizados e métricas
    isDayInfoLoading: !dayInfo,
  };
}