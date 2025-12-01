import { habitService } from '../services/HabitService.js';

export const habitController = {
  async create(req, res) {
    // Agora esperamos title E weekDays
    const { title, weekDays } = req.body;

    if (!title || !weekDays) {
      return res.status(400).json({ error: 'Título e dias da semana são obrigatórios!' });
    }
    
    // Pequena validação de segurança: weekDays deve ser um array vazio ou cheio
    if (!Array.isArray(weekDays)) {
      return res.status(400).json({ error: 'WeekDays deve ser um array de números (0-6).' });
    }

    const habit = await habitService.create({ title, weekDays });
    return res.status(201).json(habit);
  },


  async index(req, res) {
    const habits = await habitService.findAll();
    return res.json(habits);
  },

  async toggle(req, res) {
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }

    await habitService.toggle({ id, dateString: date });
    return res.status(200).send();
  }
};