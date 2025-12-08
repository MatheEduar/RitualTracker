import { Toaster } from 'sonner'; // <--- Importe aqui
import { Header } from './components/Header';
import { SummaryTable } from './components/SummaryTable';
import { HabitsProvider } from './context/HabitsContext';
import styles from './App.module.css';
import './index.css';

export function App() {
  return (
    <HabitsProvider>
      <div className={styles.container}>
        <div className={styles.content}>
          <Header />
          <SummaryTable />
        </div>
      </div>
      
      {/* Adicione o Toaster aqui, fora do conteúdo mas dentro do Provider (opcional) */}
      <Toaster position="bottom-center" richColors theme="dark" />
    </HabitsProvider>
  )
}