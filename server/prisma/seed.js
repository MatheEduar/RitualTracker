import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// IDs fixos para garantir consistência
const firstHabitId = '0730ffac-d039-4194-9571-01aa2aa0efbd'
const secondHabitId = '00880d75-a933-4fef-94ab-e05744435297'
const thirdHabitId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00'

async function main() {
  // 1. Limpeza total (Demolição)
  await prisma.habitWeekDays.deleteMany()
  await prisma.dayHabit.deleteMany()
  await prisma.habit.deleteMany()

  // 2. Definindo datas base
  // TRUQUE DE SÊNIOR: Usamos new Date() sem 'Z' para pegar o fuso local da sua máquina,
  // ou definimos explicitamente 00:00:00 no fuso local.
  
  // Data de criação (Início do ano)
  const startOfYear = new Date('2025-01-01T00:00:00') // Local Time
  
  // Data do "Quadrado Roxo" (04 de Jan)
  const fourthOfJan = new Date('2025-01-04T00:00:00') // Local Time

  /**
   * Hábito 1: Beber 2L água
   * Recorrência: Seg (1), Qua (3), Sex (5)
   */
  await prisma.habit.create({
    data: {
      id: firstHabitId,
      title: 'Beber 2L água',
      created_at: startOfYear,
      weekDays: {
        create: [
          { week_day: 1 }, { week_day: 3 }, { week_day: 5 },
        ]
      }
    }
  })

  /**
   * Hábito 2: Exercitar
   * Recorrência: Semana toda
   */
  await prisma.habit.create({
    data: {
      id: secondHabitId,
      title: 'Exercitar',
      created_at: startOfYear,
      weekDays: {
        create: [
          { week_day: 0 }, { week_day: 1 }, { week_day: 2 }, { week_day: 3 },
          { week_day: 4 }, { week_day: 5 }, { week_day: 6 },
        ]
      }
    }
  })

  /**
   * Hábito 3: Dormir 8h
   * Recorrência: Finais de semana
   */
  await prisma.habit.create({
    data: {
      id: thirdHabitId,
      title: 'Dormir 8h',
      created_at: startOfYear,
      weekDays: {
        create: [
          { week_day: 5 }, { week_day: 6 }, { week_day: 0 },
        ]
      }
    }
  })

  // 3. Simula hábitos completados (Checks)
  await Promise.all([
    // Dia 04/01 (Sábado)
    prisma.dayHabit.create({
      data: {
        habit_id: secondHabitId, // Exercitar
        day_id: fourthOfJan,     // Usa a variável local definida acima
      }
    }),
    prisma.dayHabit.create({
      data: {
        habit_id: thirdHabitId, // Dormir
        day_id: fourthOfJan,    // Usa a variável local definida acima
      }
    }),
  ])
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })