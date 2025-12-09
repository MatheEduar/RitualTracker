import { Trophy, CheckCircle, CalendarBlank } from 'phosphor-react';
import { useGlobalAnalytics } from '../../hooks/useGlobalAnalytics';
import clsx from 'clsx';
import styles from './GlobalDashboard.module.css';

/**
 * Exibe as principais métricas e análises globais do RitualTracker.
 * Deve ser colocado acima do SummaryTable.
 */
export function GlobalDashboard() {
    const { globalAnalytics, isAnalyticsLoading } = useGlobalAnalytics();

    if (isAnalyticsLoading) {
        return (
            <div className={styles.container} style={{ height: '10rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Carregando estatísticas globais...</p>
            </div>
        );
    }

    if (!globalAnalytics) {
        return null;
    }
    
    // Desestruturação dos dados analíticos
    const { 
        streak, 
        globalCompletion, 
        totalDaysTracked 
    } = globalAnalytics;


    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Performance Geral</h2>
            
            <div className={styles.metricsGrid}>

                {/* Métrica 1: Streak (Sequência de Dias) */}
                <div className={styles.metricCard}>
                    <Trophy size={32} className={styles.streakValue} weight="fill" />
                    <p className={clsx(styles.metricValue, styles.streakValue)}>
                        {streak}
                    </p>
                    <span className={styles.metricLabel}>
                        Dia(s) em Sequência
                    </span>
                </div>

                {/* Métrica 2: Conclusão Global (%) */}
                <div className={styles.metricCard}>
                    <CheckCircle size={32} className={styles.completionValue} weight="fill" />
                    <p className={clsx(styles.metricValue, styles.completionValue)}>
                        {globalCompletion}%
                    </p>
                    <span className={styles.metricLabel}>
                        Dias 100% Concluídos
                    </span>
                </div>

                {/* Métrica 3: Total de Dias Rastreáveis */}
                <div className={styles.metricCard}>
                    <CalendarBlank size={32} className={styles.daysValue} weight="fill" />
                    <p className={clsx(styles.metricValue, styles.daysValue)}>
                        {totalDaysTracked}
                    </p>
                    <span className={styles.metricLabel}>
                        Dia(s) Rastreáveis
                    </span>
                </div>

            </div>
        </div>
    );
}