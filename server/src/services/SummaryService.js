import dayjs from 'dayjs';
import { prisma } from '../lib/prisma.js';

/**
 * Serviço responsável por agregar dados de resumo e estatísticas.
 * "O Contador da Obra": Calcula o heatmap e detalha o que aconteceu em cada dia.
 */
export const summaryService = {
  
  /**
   * Busca o resumo anual (Heatmap) para pintar os quadradinhos do grid.
   * Utiliza SQL Raw para performance na agregação de dados.
   * * CORREÇÃO SPRINT 2:
   * Utilizamos SUM com CASE para ignorar registros onde o valor é 0.
   * Isso evita falsos positivos visuais em hábitos numéricos iniciados mas não progredidos.
   * * @returns {Promise<Array<{day_id: Date, completed: number, amount: number}>>}
   */
  async getSummary() {
    const summary = await prisma.$queryRaw`
      SELECT 
        D.day_id,
        -- Lógica: Se o valor for maior que 0, soma 1. Se for 0, soma 0.
        CAST(SUM(CASE WHEN D.value > 0 THEN 1 ELSE 0 END) AS int) as completed,
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
   * Busca os detalhes de um dia específico (Hábitos possíveis vs Realizados).
   * Filtra por data de criação e dia da semana (Recorrência).
   * * @param {string} dateString - Data em formato ISO (ex: "2025-01-20").
   * @returns {Promise<{possibleHabits: Array, completedHabits: Array}>}
   */
  async getDayDetails(dateString) {
    // 1. Data Base (00:00:00) -> Usada para buscar na tabela de completados (day_habits)
    // O banco salva day_habits sempre com hora zerada.
    const parsedDate = dayjs(dateString).startOf('day').toDate();
    
    // 2. Dia da Semana (0-6) -> Usado para filtrar a recorrência.
    const weekDay = dayjs(parsedDate).get('day');

    // 3. Final do Dia (23:59:59) -> Usado para filtrar a criação.
    // Garante que hábitos criados hoje (ex: às 15h) apareçam na lista de hoje.
    const endOfDay = dayjs(dateString).endOf('day').toDate();

    // A. Busca os Hábitos que DEVERIAM ser feitos hoje (Pauta)
    const possibleHabits = await prisma.habit.findMany({
      where: {
        // Regra 1: Criado antes ou durante o dia de hoje.
        created_at: {
          lte: endOfDay, 
        },
        // Regra 2: Configurado para este dia da semana.
        weekDays: {
          some: {
            week_day: weekDay,
          }
        }
      }
    });

    // B. Busca os registros do que FOI FEITO (Realizado)
    const completedHabits = await prisma.dayHabit.findMany({
      where: {
        day_id: {
          equals: parsedDate,
        }
      }
    });

    return {
      possibleHabits,
      // Retornamos o objeto completo (com 'value') para o Frontend saber o progresso numérico
      completedHabits, 
    };
  }
};