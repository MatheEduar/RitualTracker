import dayjs from 'dayjs';
import { prisma } from '../lib/prisma.js';

/**
 * Serviço responsável pela lógica de negócio dos Hábitos.
 * Aqui centralizamos a criação, listagem e manipulação de estado (CRUD, Check, Valor ou Nota).
 */
export const habitService = {
  
  /**
   * Cria um novo hábito no banco de dados.
   * Suporta categorias, cores personalizadas e metas numéricas.
   * @param {Object} params - Parâmetros de criação.
   * @param {string} params.title - Título do hábito.
   * @param {number[]} params.weekDays - Array de índices dos dias da semana (0-6).
   * @param {string} [params.category] - Categoria (ex: "Saúde"). Opcional.
   * @param {string} [params.color] - Cor em Hex (ex: "#8B5CF6"). Opcional.
   * @param {number} [params.goal] - Meta numérica (0 para booleano). Opcional.
   * @param {string} [params.unit] - Unidade de medida (ex: "ml"). Opcional.
   * @returns {Promise<Object>} O hábito criado.
   */
  async create({ title, weekDays, category, color, goal, unit }) {
    const habit = await prisma.habit.create({
      data: {
        title,
        created_at: new Date(),
        
        // Campos opcionais de visualização
        category: category || undefined,
        color: color || undefined,

        // Campos opcionais de Meta Numérica (Sprint 2)
        goal: goal || 0,
        unit: unit || null,

        // Criação dos dias da recorrência (Tabela Pivô)
        weekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay,
            }
          })
        }
      }
    });
    return habit;
  },

  /**
   * Busca todos os hábitos cadastrados.
   * @returns {Promise<Array>} Lista de hábitos.
   */
  async findAll() {
    const habits = await prisma.habit.findMany();
    return habits;
  },

  /**
   * Alterna o estado de um hábito Binário (Check/Uncheck).
   * @param {Object} params
   * @param {string} params.id - UUID do hábito.
   * @param {string} params.dateString - Data do evento em formato ISO.
   */
  async toggle({ id, dateString }) {
    const date = dayjs(dateString).startOf('day').toDate();

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: date,
          habit_id: id,
        }
      }
    });

    if (dayHabit) {
      // Cenário A: Desmarcar (Deletar registro)
      await prisma.dayHabit.delete({
        where: { id: dayHabit.id }
      });
    } else {
      // Cenário B: Marcar (Criar registro)
      await prisma.dayHabit.create({
        data: { day_id: date, habit_id: id }
      });
    }
  },

  /**
   * Atualiza o valor de um hábito Numérico (ex: Quantos ml bebeu).
   * Utiliza a estratégia UPSERT (Update or Insert).
   * @param {Object} params
   * @param {string} params.id - UUID do hábito.
   * @param {string} params.dateString - Data do evento.
   * @param {number} params.value - O valor atingido (ex: 500, 1500).
   */
  async updateValue({ id, dateString, value }) {
    const date = dayjs(dateString).startOf('day').toDate();

    await prisma.dayHabit.upsert({
      where: {
        day_id_habit_id: {
          day_id: date,
          habit_id: id,
        }
      },
      update: {
        value: value,
      },
      create: {
        day_id: date,
        habit_id: id,
        value: value,
      }
    });
  },

  /**
   * Atualiza a nota (diário) de um hábito em um dia específico.
   * @param {Object} params
   * @param {string} params.id - UUID do hábito.
   * @param {string} params.dateString - Data do evento.
   * @param {string} params.note - O texto da nota.
   */
  async updateNote({ id, dateString, note }) {
    const date = dayjs(dateString).startOf('day').toDate();

    await prisma.dayHabit.upsert({
      where: {
        day_id_habit_id: {
          day_id: date,
          habit_id: id,
        }
      },
      update: {
        note: note,
      },
      create: {
        day_id: date,
        habit_id: id,
        note: note,
      }
    });
  },

  // --- NOVO: UPDATE (U do CRUD) ---
  /**
   * Atualiza as configurações de um hábito existente, incluindo recorrência e detalhes.
   * Rota: PATCH /habits/:id
   * @param {Object} params - Parâmetros de atualização.
   * @param {string} params.id - UUID do hábito.
   * @param {string} [params.title] - Novo título. Opcional.
   * @param {number[]} [params.weekDays] - Novo array de dias da semana (0-6). Opcional.
   * @param {string} [params.category] - Nova categoria. Opcional.
   * @param {string} [params.color] - Nova cor. Opcional.
   * @param {number} [params.goal] - Nova meta numérica. Opcional.
   * @param {string} [params.unit] - Nova unidade de medida. Opcional.
   * @returns {Promise<Object>} O hábito atualizado.
   */
  async updateHabit({ id, title, weekDays, category, color, goal, unit }) {
    // Prepara a atualização dos campos escalares (Título, Cor, Meta, etc.)
    const updateData = {
      title,
      category,
      color,
      goal,
      unit,
    };

    // Remove propriedades undefined/null para não sobrescrever valores existentes
    Object.keys(updateData).forEach(key => (updateData[key] === undefined || updateData[key] === null) && delete updateData[key]);
    
    // Se a recorrência (weekDays) foi enviada, executa a transação de DELETAR/RECRIAR
    if (weekDays !== undefined) {
        // Transação: 1. Deleta a recorrência antiga, 2. Atualiza o hábito e cria a nova.
        await prisma.$transaction([
            // 1. Deleta a recorrência antiga
            prisma.habitWeekDays.deleteMany({
                where: { habit_id: id },
            }),
            // 2. Atualiza o hábito principal e cria a nova recorrência
            prisma.habit.update({
                where: { id },
                data: {
                    ...updateData,
                    weekDays: {
                        create: weekDays.map(weekDay => ({ week_day: weekDay })),
                    },
                },
            }),
        ]);
        
        // Se weekDays NÃO foi enviado, fazemos a atualização simples dos escalares
    } else {
        await prisma.habit.update({
            where: { id },
            data: updateData,
        });
    }

    // Retorna o hábito finalizado para o frontend
    const updatedHabit = await prisma.habit.findUnique({ where: { id } });
    return updatedHabit;
  },

  // --- NOVO: DELETE (D do CRUD) ---
  /**
   * Remove um hábito permanente e todas as suas ocorrências e recorrências.
   * Rota: DELETE /habits/:id
   * @param {Object} params
   * @param {string} params.id - UUID do hábito a ser deletado.
   * @returns {Promise<void>}
   */
  async deleteHabit({ id }) {
    // O 'onDelete: Cascade' definido no schema.prisma garante que
    // todos os registros em day_habits e habit_week_days também sejam apagados.
    await prisma.habit.delete({
      where: {
        id,
      },
    });
  }
};