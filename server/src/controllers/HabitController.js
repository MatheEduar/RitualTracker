import { habitService } from '../services/HabitService.js';

/**
 * Controller responsável por receber as requisições HTTP.
 */
export const habitController = {
  
  async create(req, res) {
    const { title, weekDays, category, color, goal, unit } = req.body;

    if (!title || !weekDays) {
      return res.status(400).json({ error: 'Título e dias da semana são obrigatórios!' });
    }
    
    if (!Array.isArray(weekDays)) {
      return res.status(400).json({ error: 'WeekDays deve ser um array.' });
    }

    const habit = await habitService.create({ 
      title, weekDays, category, color, goal, unit 
    });
    
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
  },

  async updateValue(req, res) {
    const { id } = req.params;
    const { date, value } = req.body;

    if (!date || value === undefined) {
      return res.status(400).json({ error: 'Data e Valor são obrigatórios' });
    }

    await habitService.updateValue({ 
      id, 
      dateString: date, 
      value: Number(value) 
    });

    return res.status(200).send();
  },

  // 👇👇👇 CERTIFIQUE-SE QUE ISSO ESTÁ AQUI 👇👇👇
  async updateNote(req, res) {
    const { id } = req.params;
    const { date, note } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }

    await habitService.updateNote({ 
      id, 
      dateString: date, 
      note: note || "" 
    });

    return res.status(200).send();
  }
};