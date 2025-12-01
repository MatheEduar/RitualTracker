import dayjs from 'dayjs';
import { prisma } from '../lib/prisma.js';

/**
 * Serviço responsável por agregar dados de resumo e detalhes diários.
 * A "Calculadora" da obra que entrega os números prontos para o Controller.
 */
export const summaryService = {
  /**
   * Retorna o resumo (Heatmap) para pintar os quadradinhos do grid.
   * Utiliza SQL Raw para performance na agregação de dados.
   * * @returns {Promise<Array<{day_id: Date, completed: number, amount: number}>>} Lista de dias com estatísticas.
   */
  async getSummary() {
    // Query Raw do Prisma:
    // 1. Agrupa por data (day_id).
    // 2. Conta quantos foram completados naquele dia.
    // 3. Sub-select: Conta quantos hábitos existiam até aquela data (amount).
    const summary = await prisma.$queryRaw`
      SELECT 
        D.day_id,
        CAST(COUNT(*) AS int) as completed,
        (
          SELECT CAST(COUNT(*) AS int)
          FROM habits H
          WHERE H.created_at <= D.day_id
        ) as amount
      FROM day_habits D
      GROUP BY D.day_id
    `;

    return summary;
  },

  /**
   * Retorna os detalhes de um dia específico para exibir no Modal.
   * Filtra hábitos pela data de criação e pela recorrência (dia da semana).
   * * @param {string} dateString - A data em formato ISO ou String (ex: "2025-01-20").
   * @returns {Promise<{possibleHabits: Array, completedHabits: Array<string>}>} Objeto com lista de hábitos e IDs dos completados.
   */
  async getDayDetails(dateString) {
    // 1. Data Base (00:00:00) -> Usada para buscar na tabela de completados (day_habits)
    // O banco salva day_habits sempre com hora zerada.
    const parsedDate = dayjs(dateString).startOf('day').toDate();
    
    // 2. Dia da Semana (0-6) -> Usado para filtrar a recorrência.
    const weekDay = dayjs(parsedDate).get('day');

    // 3. Final do Dia (23:59:59) -> Usado para filtrar a criação.
    // CORREÇÃO DE BUG TEMPORAL:
    // Se usássemos 'parsedDate' (00:00), um hábito criado hoje às 15:00 ficaria de fora.
    // Usando 'endOfDay', garantimos que qualquer hábito criado HOJE entra na lista.
    const endOfDay = dayjs(dateString).endOf('day').toDate();

    // Busca os Hábitos Possíveis (A pauta do dia)
    const possibleHabits = await prisma.habit.findMany({
      where: {
        // Regra 1: O hábito deve ter sido criado antes ou durante o dia de hoje.
        created_at: {
          lte: endOfDay, // Less Than or Equal (Menor ou igual ao final do dia)
        },
        // Regra 2: O hábito deve estar configurado para acontecer neste dia da semana.
        weekDays: {
          some: {
            week_day: weekDay,
          }
        }
      }
    });

    // Busca os Hábitos Completados (O que foi feito)
    const completedHabits = await prisma.dayHabit.findMany({
      where: {
        day_id: {
          equals: parsedDate, // Aqui comparamos com 00:00 exato
        }
      }
    });

    // Retorna formatado
    return {
      possibleHabits,
      // Mapeamos apenas para retornar um array de IDs simples ['uuid-1', 'uuid-2']
      completedHabits: completedHabits.map(row => row.habit_id),
    };
  }
};