import { useState, useEffect } from "react";
import { habitService } from "../services/habitService";

export function useSummary() {
  const [summary, setSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Função interna para buscar dados
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const data = await habitService.getSummary();
        setSummary(data);
      } catch (error) {
        console.error("Erro ao buscar resumo:", error);
        // Aqui poderia ter um toast de erro
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // O Hook retorna apenas o que a View precisa saber
  return {
    summary,
    isLoading
  };
}