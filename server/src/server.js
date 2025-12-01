// src/server.js

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import dayjs from "dayjs";

const app = express();
const prisma = new PrismaClient();

// 1. CONFIGURAÇÃO DE SEGURANÇA (CORS)
app.use(cors());

// 2. CONFIGURAÇÃO DO JSON
app.use(express.json());

// 3. ROTA DE TESTE (Health Check)
app.get('/', (req, res) => {
  return res.json({ message: "Olá, Jovem! O Backend do Ritual está ON (ES Modules)! 🚀" });
});

// 4. ROTA: LISTAR HÁBITOS
app.get('/habits', async (req, res) => {
  const habits = await prisma.habit.findMany();
  return res.json(habits);
});


// ROTA: CRIAR HÁBITO
// O Frontend vai mandar um JSON tipo: { "title": "Beber 2L de água" }
app.post('/habits', async (req, res) => {
  const { title } = req.body;

  // Validação Básica (Princípio Fail Fast)
  // Se não tiver título, nem incomoda o banco de dados. Devolve o erro na cara.
  if (!title) {
    return res.status(400).json({ error: 'O título do hábito é obrigatório, jovem!' });
  }

  // Criação no Banco
  const habit = await prisma.habit.create({
    data: {
      title: title,
    }
  });

  return res.status(201).json(habit);
});


// ROTA: RESUMO (SUMMARY)
// Retorna uma lista de dias com: Data, Quantos completou, Quantos eram possíveis
app.get('/summary', async (req, res) => {
  // Query Raw do Prisma
  // Selecionamos a data (day_id)
  // Contamos os registros na tabela day_habits (completed)
  // Fazemos uma sub-query para contar quantos hábitos existiam naquela data (amount)
  
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
  `

  // O "raw" pode retornar datas como objetos complexos, o JSON cuida disso
  return res.json(summary);
});


// ROTA: DETALHES DO DIA
// Recebe a data via query param: localhost:3333/day?date=2025-01-05T00:00:00.000Z
app.get('/day', async (req, res) => {
  const { date } = req.query;

  // Converte a string para data e zera as horas (começo do dia)
  // O 'startOf' garante que pegamos o dia exato
  const parsedDate = dayjs(date).startOf('day').toDate();
  const weekDay = dayjs(parsedDate).get('day'); // 0 (Dom) a 6 (Sab)

  // 1. Buscar todos os hábitos possíveis
  // Regra: O hábito deve ter sido criado ANTES ou NO dia escolhido
  const possibleHabits = await prisma.habit.findMany({
    where: {
      created_at: {
        lte: parsedDate, // Less Than or Equal (Menor ou igual a data)
      },
      // Aqui poderíamos filtrar por dia da semana se tivéssemos essa feature (ex: só segundas)
      // Por enquanto, assumimos que todo hábito é diário.
    }
  });

  // 2. Buscar quais hábitos foram completados NESTE dia
  const completedHabits = await prisma.dayHabit.findMany({
    where: {
      day_id: {
        equals: parsedDate,
      }
    }
  });

  // Retorna a lista de possíveis e apenas os IDs dos completados
  return res.json({
    possibleHabits,
    completedHabits: completedHabits.map(row => row.habit_id),
  });
});


// 5. INICIALIZAR O SERVIDOR
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`⚡ Servidor rodando na porta ${PORT}`);
});