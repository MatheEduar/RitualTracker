import dayjs from 'dayjs';
import { prisma } from '../lib/prisma.js';

/**
 * Serviço responsável pela lógica de negócio dos Hábitos.
 * Aqui centralizamos a criação, listagem e manipulação de estado (Check, Valor ou Nota).
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
        // Se goal não for informado, assume 0 (comportamento binário padrão)
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
   * Se existir registro no dia, remove (desmarca). Se não, cria (marca).
   * @param {Object} params
   * @param {string} params.id - UUID do hábito.
   * @param {string} params.dateString - Data do evento em formato ISO.
   */
  async toggle({ id, dateString }) {
    // Normaliza a data para 00:00:00 para consistência na busca
    const date = dayjs(dateString).startOf('day').toDate();

    // Verifica se já existe o registro de "Feito" neste dia
    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: date,
          habit_id: id,
        }
      }
    });

    if (dayHabit) {
      // Cenário A: Já estava marcado -> Desmarcar (Deletar registro)
      await prisma.dayHabit.delete({
        where: { id: dayHabit.id }
      });
    } else {
      // Cenário B: Não estava marcado -> Marcar (Criar registro)
      // O valor default será 1 (definido no schema)
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

    // UPSERT: O Canivete Suíço do Banco de Dados
    // Tenta encontrar pelo par único (dia + hábito).
    // - Achou? Roda o 'update' e muda o valor.
    // - Não achou? Roda o 'create' e cria um novo registro com esse valor.
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
   * Rota: PATCH /habits/:id/note
   * Utiliza UPSERT para permitir criar uma nota mesmo sem ter completado o hábito.
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
        // Ao criar apenas pela nota, o valor default será 1 (definido no schema).
        // Para hábitos binários, isso marcará como feito (efeito colateral aceitável).
        // Para numéricos, marcará como 1 (iniciado, mas não necessariamente completo).
      }
    });
  }
};