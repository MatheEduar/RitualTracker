import { summaryService } from '../services/SummaryService.js';

/**
 * Controller responsável por receber as requisições HTTP relacionadas a Resumo e Estatísticas.
 * Gerencia a visualização do Heatmap (Resumo), Detalhes do Dia e Análise Global.
 */
export const summaryController = {
  
  /**
   * Busca o resumo anual (Heatmap). (R da entidade DayHabit)
   * Rota: GET /summary
   * @param {Object} req 
   * @param {Object} res 
   */
  async index(req, res) {
    const summary = await summaryService.getSummary();
    return res.json(summary);
  },

  /**
   * Busca os detalhes de um dia específico.
   * Rota: GET /day?date=...
   * @param {Object} req 
   * @param {Object} res 
   */
  async showDay(req, res) {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Data query param é obrigatória' });
    }

    const details = await summaryService.getDayDetails(date);
    return res.json(details);
  },
  
  // --- NOVO: ANÁLISE GLOBAL (Dashboard Principal) ---
  
  /**
   * Busca as métricas globais de progresso (Streak, Taxa de Conclusão Global).
   * Rota: GET /analytics/global
   * @param {Object} req 
   * @param {Object} res 
   */
  async globalAnalytics(req, res) {
    try {
      const analytics = await summaryService.getGlobalAnalytics();
      return res.json(analytics);
    } catch (error) {
      console.error('Erro ao buscar análises globais:', error);
      return res.status(500).json({ error: 'Erro interno ao processar analytics.' });
    }
  }
};