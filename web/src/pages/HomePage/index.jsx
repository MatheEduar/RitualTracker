// src/pages/HomePage/index.jsx
import { GlobalDashboard } from '../../components/GlobalDashboard';
import { SummaryTable } from '../../components/SummaryTable';
import styles from './HomePage.module.css';

/**
 * Componente principal da rota raiz (/).
 * Estrutura e alinha o Dashboard Global e a Tabela de Resumo (Heatmap).
 */
export function HomePage() {
  return (
    <div className={styles.container}>
      
      {/* Dashboard Global fica na primeira linha */}
      <GlobalDashboard />

      {/* A Tabela de Resumo (Heatmap) fica logo abaixo */}
      <SummaryTable />

    </div>
  );
}