import express from 'express';
import cors from 'cors';
import { routes } from './routes.js';

const app = express();

// 1. Segurança
app.use(cors());

// 2. JSON
app.use(express.json());

// 3. Rotas
app.use(routes);

// 4. Start
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`⚡ Servidor rodando na porta ${PORT}`);
});