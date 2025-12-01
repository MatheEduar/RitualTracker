import dayjs from 'dayjs';
import { prisma } from '../lib/prisma.js';

export const habitService = {
    async create({ title, weekDays }) { // Recebe weekDays (array de números [0, 1, 5])
    const habit = await prisma.habit.create({
      data: {
        title,
        created_at: new Date(), // Força a data de agora
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

  async findAll() {
    const habits = await prisma.habit.findMany();
    return habits;
  },

  async toggle({ id, dateString }) {
    // Regra de Negócio: Normalizar a data
    const date = dayjs(dateString).startOf('day').toDate();

    // Verifica se já existe
    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: date,
          habit_id: id,
        }
      }
    });

    if (dayHabit) {
      // Desmarcar
      await prisma.dayHabit.delete({
        where: { id: dayHabit.id }
      });
    } else {
      // Marcar
      await prisma.dayHabit.create({
        data: { day_id: date, habit_id: id }
      });
    }
  }

};