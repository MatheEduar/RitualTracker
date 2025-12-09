import dayjs from 'dayjs';
import { prisma } from '../lib/prisma.js';

/**
 * Serviço responsável por agregar dados de resumo e estatísticas.
 * "O Contador da Obra": Calcula o heatmap, detalha o dia e fornece análises globais.
 */
export const summaryService = {
  
  /**
   * Busca o resumo anual (Heatmap) para pintar os quadradinhos do grid.
   * Rota: GET /summary
   * @returns {Promise<Array<{day_id: Date, completed: number, amount: number}>>}
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
   * Rota: GET /day?date=...
   * @param {string} dateString - Data em formato ISO (ex: "2025-01-20").
   * @returns {Promise<{possibleHabits: Array, completedHabits: Array}>}
   */
  async getDayDetails(dateString) {
    const parsedDate = dayjs(dateString).startOf('day').toDate();
    const weekDay = dayjs(parsedDate).get('day');
    const endOfDay = dayjs(dateString).endOf('day').toDate();

    // A. Busca os Hábitos que DEVERIAM ser feitos hoje (Pauta)
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: endOfDay, 
        },
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
      completedHabits, 
    };
  },

  // --- NOVO: ANÁLISE GLOBAL E STREAK ---
  
  /**
   * Calcula as métricas globais do RitualTracker (Streak, Porcentagem de Conclusão de Dias).
   * Rota: GET /analytics/global
   * @returns {Promise<{totalDaysTracked: number, completedDaysCount: number, globalCompletion: number, streak: number}>}
   */
  async getGlobalAnalytics() {
    const today = dayjs().startOf('day').toDate();
    
    // 1. Encontra a data do primeiro hábito criado para definir o início do rastreamento.
    const firstHabit = await prisma.habit.findFirst({
      orderBy: { created_at: 'asc' },
      select: { created_at: true },
    });

    if (!firstHabit) {
      return { totalDaysTracked: 0, completedDaysCount: 0, globalCompletion: 0, streak: 0 };
    }

    const startDate = dayjs(firstHabit.created_at).startOf('day');
    
    // Calcula quantos dias passaram desde o primeiro hábito até hoje
    const totalDaysTracked = dayjs(today).diff(startDate, 'day') + 1;

    // 2. Busca todos os dias que foram 100% concluídos (Dias "Verdes")
    // Compara a soma de checks concluídos (value > 0) com o total de hábitos possíveis para aquele dia.
    const completedDays = await prisma.$queryRaw`
      SELECT D.day_id
      FROM day_habits D
      GROUP BY D.day_id
      HAVING CAST(SUM(CASE WHEN D.value > 0 THEN 1 ELSE 0 END) AS INT) = (
        SELECT CAST(COUNT(*) AS INT) 
        FROM habits H
        INNER JOIN habit_week_days HWD ON H.id = HWD.habit_id
        -- Garante que o hábito foi criado antes ou no dia do registro
        WHERE HWD.week_day = EXTRACT(DOW FROM D.day_id) AND H.created_at <= D.day_id
      )
      ORDER BY D.day_id DESC;
    `;
    
    // 3. Cálculo da Streak (Sequência de Dias Concluídos)
    let streak = 0;
    let lastDay = dayjs().startOf('day');
    
    const completedDaysMap = completedDays.map(d => dayjs(d.day_id).startOf('day').valueOf());
    
    // Itera para trás para encontrar a sequência contínua
    while (true) {
        const targetDay = lastDay.valueOf();
        
        // Se a lista de dias completos inclui o dia que estamos checando...
        if (completedDaysMap.includes(targetDay)) {
            streak++;
            lastDay = lastDay.subtract(1, 'day');
        } else if (dayjs(targetDay).isBefore(startDate, 'day')) {
             // Se chegarmos antes do início do rastreamento, para.
            break;
        } else {
             // Se o dia não estiver completo, a sequência quebra.
            break; 
        }
    }

    const completedDaysCount = completedDays.length;
    // Porcentagem de dias totalmente concluídos em relação ao total rastreado
    const globalCompletion = totalDaysTracked > 0 ? Math.round((completedDaysCount / totalDaysTracked) * 100) : 0;
    
    return {
      totalDaysTracked,
      completedDaysCount,
      globalCompletion, 
      streak,
    };
  }
};