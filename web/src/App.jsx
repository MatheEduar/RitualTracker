// src/App.jsx

import { Toaster } from 'sonner';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { SummaryTable } from './components/SummaryTable';
import { HabitsProvider } from './context/HabitsContext';
import styles from './App.module.css';
import './index.css';

import { PaginaDia } from './pages/PaginaDia'; // <--- O componente da nova página

export function App() {
  return (
    <HabitsProvider>
      <div className={styles.container}>
        <div className={styles.content}>
          
          <Header /> 

          <Routes>
            {/* Rota Home: Tabela de Resumo */}
            <Route path="/" element={<SummaryTable />} />
            
            {/* Rota do Dia: Lê o parâmetro :date da URL */}
            <Route path="/day/:date" element={<PaginaDia />} />
          </Routes>
          
        </div>
      </div>
      
      <Toaster position="bottom-center" richColors theme="dark" />
    </HabitsProvider>
  )
}