import { Router } from 'express';
import { habitController } from './controllers/HabitController.js';
import { summaryController } from './controllers/SummaryController.js';

export const routes = Router();

// Rota de Teste
routes.get('/', (req, res) => {
  return res.json({ message: "Olá, Jovem! Backend Ritual ON 🚀" });
});

// --- HÁBITOS (CRUD) ---

// Create (C)
routes.post('/habits', habitController.create);
// Read (R)
routes.get('/habits', habitController.index); 

// --- NOVO: UPDATE e DELETE PERMANENTE ---

// Update (U) - Atualiza metadados e recorrência
routes.patch('/habits/:id', habitController.update); 
// Delete (D) - Remove o hábito permanentemente
routes.delete('/habits/:id', habitController.delete); 

// --- AÇÕES DIÁRIAS ---

// Ações no Registro do Dia
routes.patch('/habits/:id/toggle', habitController.toggle); // Binário (Check)
routes.patch('/habits/:id/value', habitController.updateValue); // Numérico (Input)
routes.patch('/habits/:id/note', habitController.updateNote); // Notas (Diário)

// --- RESUMO E DETALHES ---
routes.get('/summary', summaryController.index);
routes.get('/day', summaryController.showDay);