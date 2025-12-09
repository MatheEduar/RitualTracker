// src/App.jsx

import { Toaster } from 'sonner';
import { Routes, Route } from 'react-router-dom'; 
import { Header } from './components/Header';
import { SummaryTable } from './components/SummaryTable';
import { HabitsProvider } from './context/HabitsContext';
import styles from './App.module.css';
import './index.css';

// Certifique-se de que o caminho para PaginaDia e PaginaConfiguracoes está correto!
import { PaginaDia } from './pages/PaginaDia';
import { PaginaConfiguracoes } from './pages/PaginaConfiguracoes'; // <--- VERIFIQUE ESTE CAMINHO

export function App() {
  return (
    <HabitsProvider>
      <div className={styles.container}>
        <div className={styles.content}>
          
          <Header /> 

          <Routes>
            {/* Rota Home */}
            <Route path="/" element={<SummaryTable />} />
            
            {/* Rota do Dia */}
            <Route path="/day/:date" element={<PaginaDia />} />
            
            {/* Rota de Configurações */}
            <Route path="/config" element={<PaginaConfiguracoes />} />
          </Routes>
          
        </div>
      </div>
      
      <Toaster position="bottom-center" richColors theme="dark" />
    </HabitsProvider>
  )
}