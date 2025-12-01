import { createContext, useState, useEffect, useContext } from 'react';
import { habitService } from '../services/habitService';

// 1. Criar o Contexto (O canal de comunicação)
const HabitsContext = createContext({});

// 2. Criar o Provider (A antena emissora)
export function HabitsProvider({ children }) {
  const [summary, setSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função que vai ao backend buscar o resumo atualizado
  async function refreshSummary() {
    try {
      // Não ativamos o isLoading aqui para não "piscar" o ecrã, 
      // apenas atualizamos os dados silenciosamente.
      const data = await habitService.getSummary();
      setSummary(data);
    } catch (error) {
      console.error("Erro ao atualizar o resumo:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Carrega a primeira vez quando a App abre
  useEffect(() => {
    refreshSummary();
  }, []);

  return (
    <HabitsContext.Provider value={{ summary, isLoading, refreshSummary }}>
      {children}
    </HabitsContext.Provider>
  )
}

// 3. Hook Personalizado (O rádio recetor)
// Simplifica a importação noutros ficheiros
export function useHabits() {
  const context = useContext(HabitsContext);
  return context;
}