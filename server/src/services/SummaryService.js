import dayjs from 'dayjs';
import { prisma } from '../lib/prisma.js';

export const summaryService = {
  async getSummary() {
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

  async getDayDetails(dateString) {
    const parsedDate = dayjs(dateString).startOf('day').toDate();

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: { lte: parsedDate },
      }
    });

    const completedHabits = await prisma.dayHabit.findMany({
      where: {
        day_id: { equals: parsedDate }
      }
    });

    return {
      possibleHabits,
      completedHabits: completedHabits.map(row => row.habit_id),
    };
  }
};