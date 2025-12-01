// src/server.js

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

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

// src/server.js (Adicione isso antes do app.listen)

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


// 5. INICIALIZAR O SERVIDOR
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`⚡ Servidor rodando na porta ${PORT}`);
});