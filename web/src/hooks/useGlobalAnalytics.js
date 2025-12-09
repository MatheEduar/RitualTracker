// src/hooks/useGlobalAnalytics.js

import { useState, useEffect } from "react";
import { habitService } from "../services/habitService";

/**
 * Hook customizado para buscar e gerenciar as métricas globais do RitualTracker.
 * @returns {{globalAnalytics: Object, isAnalyticsLoading: boolean}}
 */
export function useGlobalAnalytics() {
  const [globalAnalytics, setGlobalAnalytics] = useState(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  // Função para buscar os dados de análise do backend
  const fetchGlobalAnalytics = async () => {
    try {
      setIsAnalyticsLoading(true);
      const data = await habitService.getGlobalAnalytics();
      setGlobalAnalytics(data);
    } catch (error) {
      console.error("Erro ao buscar análises globais:", error);
      setGlobalAnalytics(null);
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalAnalytics();
    
    // Opcional: Adicionar um intervalo para buscar a streak/progresso de tempos em tempos
    // const interval = setInterval(fetchGlobalAnalytics, 60000); 
    // return () => clearInterval(interval);

  }, []);

  return {
    globalAnalytics,
    isAnalyticsLoading,
    refetch: fetchGlobalAnalytics, // Permite recarregar os dados manualmente (útil após um check)
  };
}