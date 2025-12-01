import { Header } from './components/Header';
import { SummaryTable } from './components/SummaryTable'; // Importe aqui
import styles from './App.module.css';
import './index.css';

export function App() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        
        <Header />
        
        {/* Aqui entra a tabela */}
        <SummaryTable />

      </div>
    </div>
  )
}