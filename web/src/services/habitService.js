import { api } from "../lib/axios";

/**
 * Serviço de comunicação com o Backend (API).
 * Traduz as chamadas de função do Frontend para requisições HTTP (GET, POST, PATCH, DELETE).
 * Gerencia tanto as ações diárias (toggle, value, note) quanto o CRUD permanente (habits).
 */
export const habitService = {
  
  // --- INFORMAÇÕES DE RESUMO E ANÁLISE ---

  /**
   * Busca os dados agregados para construir o Heatmap.
   * Rota: GET /summary
   * @returns {Promise<Array>} Lista de dias com total e completados.
   */
  getSummary: async () => {
    const response = await api.get('/summary');
    return response.data;
  },

  /**
   * Busca os detalhes de um dia específico para o Modal/Página.
   * Rota: GET /day?date=...
   * @param {string} date - Data em formato ISO para o backend.
   * @returns {Promise<Object>} Dados do dia (possibleHabits, completedHabits).
   */
  getDayDetails: async (date) => {
    const response = await api.get('/day', {
      params: { date }
    });
    return response.data;
  },

  /**
   * Busca as métricas globais para o Dashboard principal (Streak, Conclusão Total).
   * Rota: GET /analytics/global
   * @returns {Promise<Object>} Dados de analytics globais.
   */
  getGlobalAnalytics: async () => {
    const response = await api.get('/analytics/global');
    return response.data;
  },
  
  // --- AÇÕES DIÁRIAS (Modificam o registro do dia) ---

  /**
   * Alterna o estado de um hábito Binário (Marca/Desmarca).
   * Rota: PATCH /habits/:id/toggle
   * @param {string} id - UUID do hábito.
   * @param {string} date - Data do evento em formato ISO.
   */
  toggleHabit: async (id, date) => {
    await api.patch(`/habits/${id}/toggle`, {
      date: date 
    });
  },

  /**
   * Atualiza o valor de um hábito Numérico.
   * Rota: PATCH /habits/:id/value
   * @param {string} id - UUID do hábito.
   * @param {string} date - Data do evento em formato ISO.
   * @param {number} value - O valor atingido.
   */
  updateValue: async (id, date, value) => {
    await api.patch(`/habits/${id}/value`, {
      date: date,
      value: value
    });
  },

  /**
   * Atualiza a nota (diário) de um hábito em um dia específico.
   * Rota: PATCH /habits/:id/note
   * @param {string} id - UUID do hábito.
   * @param {string} date - Data do evento em formato ISO.
   * @param {string} note - O texto da nota.
   */
  updateNote: async (id, date, note) => {
    await api.patch(`/habits/${id}/note`, {
      date: date,
      note: note
    });
  },
  
  // --- GERENCIAMENTO PERMANENTE (CRUD) ---

  /**
   * Busca a lista completa de hábitos permanentes. (R do CRUD)
   * Rota: GET /habits
   * @returns {Promise<Array>} Lista de todos os hábitos criados.
   */
  findAllHabits: async () => {
    const response = await api.get('/habits');
    return response.data;
  },

  /**
   * Atualiza as configurações de um hábito permanente (Título, Cor, Recorrência, Meta). (U do CRUD)
   * Rota: PATCH /habits/:id
   * @param {string} id - UUID do hábito.
   * @param {Object} data - Dados a serem atualizados (title, weekDays, goal, unit, etc.).
   */
  updateHabit: async (id, data) => {
    await api.patch(`/habits/${id}`, data);
  },

  /**
   * Deleta um hábito permanente. (D do CRUD)
   * Rota: DELETE /habits/:id
   * @param {string} id - UUID do hábito a ser deletado.
   */
  deleteHabit: async (id) => {
    await api.delete(`/habits/${id}`);
  },
};