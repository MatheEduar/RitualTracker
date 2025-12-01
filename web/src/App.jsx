import { Header } from './components/Header';
import { SummaryTable } from './components/SummaryTable';
import { HabitsProvider } from './context/HabitsContext'; // <--- Importa o Provider
import styles from './App.module.css';
import './index.css';

export function App() {
  return (
    // Envolvemos tudo com o Provider
    <HabitsProvider>
      <div className={styles.container}>
        <div className={styles.content}>
          <Header />
          <SummaryTable />
        </div>
      </div>
    </HabitsProvider>
  )
}