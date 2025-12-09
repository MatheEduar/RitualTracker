// src/pages/PaginaDia/index.jsx
import dayjs from 'dayjs';
// CORREÇÃO: Removemos Dumbbell e Utensils (se necessário) e usamos ícones garantidos
import { CaretLeft, Drop, ListChecks } from 'phosphor-react';
import { useParams, useNavigate } from 'react-router-dom';
import { HabitList } from '../../components/HabitList';
import { useDayDetails } from '../../hooks/useDayDetails';
import styles from './PaginaDia.module.css';

export function PaginaDia() {
  const { date } = useParams();
  const navigate = useNavigate();

  const { isDayInfoLoading, analyticsData } = useDayDetails(date); 

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');
  const dateISO = parsedDate.toISOString();

  if (isDayInfoLoading || !analyticsData) {
    return <div style={{ padding: '4rem', color: 'var(--text-secondary)' }}>Carregando dados do dia...</div>;
  }
  
  const { categories, analytics } = analyticsData;
  const trainingCompletion = analytics.totalTraining > 0 
    ? Math.round((analytics.completedTraining / analytics.totalTraining) * 100)
    : 0;
  
  const totalHabits = categories.Treino.length + categories.Dieta.length + categories.Geral.length + categories.Outros.length;
  
  return (
    <div className={styles.container}>
      
      {/* 1. HEADER E BOTÃO VOLTAR */}
      <button 
        onClick={() => navigate('/')} 
        className={styles.backButton}
      >
        <CaretLeft size={20} />
        Voltar para o Resumo
      </button>

      <span className={styles.dayLabel}>
        {dayOfWeek}
      </span>
      <h1 className={styles.dateTitle}>
        {dayAndMonth}
      </h1>
      
      <hr className={styles.divider} />


      {/* 2. DASHBOARD DE ANALYTICS */}
      <h2 className={styles.dashboardTitle}>
        Dashboard de Progresso ({totalHabits} Hábitos)
      </h2>
      <div className={styles.dashboardMetrics}>
        
        {/* Métrica 1: Hidratação (Dieta) */}
        <div className={styles.metricBox}>
          <Drop size={24} color="#3b82f6" weight="fill" />
          <p className={styles.metricValue}>
            {(analytics.totalWaterIntake / 1000).toFixed(1)} L
          </p>
          <span className={styles.metricLabel}>
            Água Consumida
          </span>
        </div>

        {/* Métrica 2: Treino (AGORA USA LISTCHECKS) */}
        <div className={styles.metricBox}>
          <ListChecks size={24} color="#ef4444" weight="fill" />
          <p className={styles.metricValue}>
            {trainingCompletion}%
          </p>
          <span className={styles.metricLabel}>
            Treino Completo
          </span>
        </div>
        
        {/* Métrica 3: Dieta Geral (Mock) */}
        <div className={styles.metricBox}>
          {/* Substituído Utensils por Drop para evitar novo erro */}
          <Drop size={24} color="#22c55e" weight="fill" /> 
          <p className={styles.metricValue}>
            {categories.Dieta.filter(h => h.isCompleted).length} / {categories.Dieta.length}
          </p>
          <span className={styles.metricLabel}>
            Dieta (Hábitos)
          </span>
        </div>
      </div>
      
      <hr className={styles.divider} />


      {/* 3. LISTA DETALHADA INTERATIVA (TODOS OS HÁBITOS) */}
      <h3 className={styles.sectionTitle}>
        <ListChecks size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
        Interação (Todos os Hábitos)
      </h3>
      
      <HabitList date={dateISO} /> 
    </div>
  );
}