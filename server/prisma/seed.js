// server/prisma/seed.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Dados falsos para popular o banco
async function main() {
  // 1. Limpa o banco antes de começar (Demolição)
  await prisma.dayHabit.deleteMany()
  await prisma.habit.deleteMany()

  // 2. Cria hábitos
  // Promessas executadas em paralelo
  const firstHabitId = '0730ffac-d039-4194-9571-01aa2aa0efbd'
  const secondHabitId = '00880d75-a933-4fef-94ab-e05744435297'
  const thirdHabitId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00'

  await Promise.all([
    prisma.habit.create({
      data: {
        id: firstHabitId,
        title: 'Beber 2L água',
        created_at: new Date('2025-01-01T00:00:00.000z'),
      }
    }),
    prisma.habit.create({
      data: {
        id: secondHabitId,
        title: 'Exercitar',
        created_at: new Date('2025-01-03T00:00:00.000z'),
      }
    }),
    prisma.habit.create({
      data: {
        id: thirdHabitId,
        title: 'Dormir 8h',
        created_at: new Date('2025-01-08T00:00:00.000z'),
      }
    }),
  ])

  // 3. Simula dias completados (Histórico)
  await Promise.all([
    // Dia 02/01 (Só tinha o hábito 1)
    prisma.dayHabit.create({
      data: {
        habit_id: firstHabitId,
        day_id: new Date('2025-01-02T00:00:00.000z'),
      }
    }),
    // Dia 04/01 (Completou os 2 hábitos disponíveis)
    prisma.dayHabit.create({
      data: {
        habit_id: firstHabitId,
        day_id: new Date('2025-01-04T00:00:00.000z'),
      }
    }),
    prisma.dayHabit.create({
      data: {
        habit_id: secondHabitId,
        day_id: new Date('2025-01-04T00:00:00.000z'),
      }
    })
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