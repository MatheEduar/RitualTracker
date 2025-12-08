import { Router } from 'express';
import { habitController } from './controllers/HabitController.js';
import { summaryController } from './controllers/SummaryController.js';

export const routes = Router();

// Rota de Teste
routes.get('/', (req, res) => {
  return res.json({ message: "Olá, Jovem! Backend Ritual ON 🚀" });
});

// --- HÁBITOS (CRUD) ---
routes.post('/habits', habitController.create);
routes.get('/habits', habitController.index);

// --- AÇÕES NOS HÁBITOS ---
routes.patch('/habits/:id/toggle', habitController.toggle); // Binário (Check)
routes.patch('/habits/:id/value', habitController.updateValue); // Numérico (Input)

// 👇👇👇 A ROTA QUE PROVAVELMENTE FALTOU 👇👇👇
routes.patch('/habits/:id/note', habitController.updateNote); // Notas (Diário)

// --- RESUMO E DETALHES ---
routes.get('/summary', summaryController.index);
routes.get('/day', summaryController.showDay);