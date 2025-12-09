import { habitService } from '../services/HabitService.js';

/**
 * Controller responsável por receber as requisições HTTP e despachar para o Serviço.
 * Gerencia o CRUD completo dos Hábitos (Create, Read, Update, Delete) e as ações diárias (toggle, value, note).
 */
export const habitController = {
  
  /**
   * Cria um novo hábito. (C do CRUD)
   * Rota: POST /habits
   * @param {Object} req - Objeto de requisição do Express.
   * @param {Object} res - Objeto de resposta do Express.
   */
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

  /**
   * Lista todos os hábitos. (R do CRUD)
   * Rota: GET /habits
   * @param {Object} req 
   * @param {Object} res 
   */
  async index(req, res) {
    const habits = await habitService.findAll();
    return res.json(habits);
  },

  /**
   * Altera o estado de um hábito Binário.
   * Rota: PATCH /habits/:id/toggle
   * @param {Object} req 
   * @param {Object} res 
   */
  async toggle(req, res) {
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }

    await habitService.toggle({ id, dateString: date });
    return res.status(200).send();
  },

  /**
   * Atualiza o valor de progresso de um hábito Numérico.
   * Rota: PATCH /habits/:id/value
   * @param {Object} req 
   * @param {Object} res 
   */
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

  /**
   * Atualiza a nota (diário) de um hábito.
   * Rota: PATCH /habits/:id/note
   * @param {Object} req 
   * @param {Object} res 
   */
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
  },

  // --- NOVO: UPDATE (U do CRUD) ---
  /**
   * Atualiza os metadados e recorrência de um hábito permanente.
   * Rota: PATCH /habits/:id
   * @param {Object} req 
   * @param {Object} res 
   */
  async update(req, res) {
    const { id } = req.params;
    // Extrai todos os campos que podem ser atualizados
    const { title, weekDays, category, color, goal, unit } = req.body;
    
    // Filtra apenas os campos que vieram no corpo da requisição
    const updateData = { title, weekDays, category, color, goal, unit };
    const hasDataToUpdate = Object.values(updateData).some(val => val !== undefined);

    if (!id) {
      return res.status(400).json({ error: 'ID do hábito é obrigatório.' });
    }
    if (!hasDataToUpdate) {
      return res.status(400).json({ error: 'Nenhum dado para atualização foi fornecido.' });
    }
    
    // Executa o serviço de atualização com a transação de weekDays
    const updatedHabit = await habitService.updateHabit({ 
      id, ...updateData 
    });

    return res.status(200).json(updatedHabit);
  },

  // --- NOVO: DELETE (D do CRUD) ---
  /**
   * Deleta um hábito permanente e todas as suas ocorrências (Cascade Delete).
   * Rota: DELETE /habits/:id
   * @param {Object} req 
   * @param {Object} res 
   */
  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID do hábito é obrigatório.' });
    }

    await habitService.deleteHabit({ id });
    
    // Retorna 204 No Content, que é o padrão para DELETE bem sucedido
    return res.status(204).send();
  }
};