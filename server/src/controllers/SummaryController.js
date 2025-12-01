import { summaryService } from '../services/SummaryService.js';

export const summaryController = {
  async index(req, res) {
    const summary = await summaryService.getSummary();
    return res.json(summary);
  },

  async showDay(req, res) {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Data query param é obrigatória' });
    }

    const details = await summaryService.getDayDetails(date);
    return res.json(details);
  }
};