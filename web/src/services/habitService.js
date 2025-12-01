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

  toggleHabit: async (id, date) => {
    // Precisamos enviar a data no body para o backend saber qual dia alterar
    await api.patch(`/habits/${id}/toggle`, {
      date: date // envia a data ISO
    });
  }
};