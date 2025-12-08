import { api } from "../lib/axios";

export const habitService = {
  // 1. Busca o resumo (Heatmap)
  getSummary: async () => {
    const response = await api.get('/summary');
    return response.data;
  },

  // 2. Busca os detalhes do dia
  getDayDetails: async (date) => {
    const response = await api.get('/day', {
      params: { date }
    });
    return response.data;
  },

  // 3. Toggle (Binário - Checkbox)
  toggleHabit: async (id, date) => {
    await api.patch(`/habits/${id}/toggle`, {
      date: date 
    });
  },

  // 4. Atualizar Valor (Numérico)
  updateValue: async (id, date, value) => {
    await api.patch(`/habits/${id}/value`, {
      date: date,
      value: value
    });
  },

  // 5. Atualizar Nota (Diário) <--- ESTA É A FUNÇÃO QUE ESTÁ FALTANDO
  updateNote: async (id, date, note) => {
    await api.patch(`/habits/${id}/note`, {
      date: date,
      note: note
    });
  }
};