import { habitService } from '../services/HabitService.js';

export const habitController = {
  async create(req, res) {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'O título do hábito é obrigatório, jovem!' });
    }

    const habit = await habitService.create({ title });
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