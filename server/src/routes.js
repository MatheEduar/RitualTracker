import { Router } from 'express';
import { habitController } from './controllers/HabitController.js';
import { summaryController } from './controllers/SummaryController.js';

export const routes = Router();

// Rota de Teste
routes.get('/', (req, res) => {
  return res.json({ message: "Olá, Jovem! O Backend do Ritual está ON (Refatorado)! 🚀" });
});

// Hábitos
routes.post('/habits', habitController.create);
routes.get('/habits', habitController.index);
routes.patch('/habits/:id/toggle', habitController.toggle);

// Resumo e Detalhes
routes.get('/summary', summaryController.index);
routes.get('/day', summaryController.showDay);