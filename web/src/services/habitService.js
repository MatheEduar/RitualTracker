import { api } from "../lib/axios";

// Classe ou Objeto que agrupa as chamadas relacionadas a Hábitos
export const habitService = {
  // Busca o resumo do ano (Heatmap)
  getSummary: async () => {
    const response = await api.get('/summary');
    return response.data;
  },

  // Busca os detalhes de um dia específico
  getDayDetails: async (date) => {
    const response = await api.get('/day', {
      params: { date }
    });
    return response.data;
  },

  // (Futuro) Marcar/Desmarcar hábito
  toggleHabit: async (id) => {
    await api.patch(`/habits/${id}/toggle`);
  }
};