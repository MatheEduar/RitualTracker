// src/App.jsx
import { Toaster } from 'sonner';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
// import { SummaryTable } from './components/SummaryTable'; // Não precisa mais aqui
import { HabitsProvider } from './context/HabitsContext';
import styles from './App.module.css';
import './index.css';

import { PaginaDia } from './pages/PaginaDia';
import { PaginaConfiguracoes } from './pages/PaginaConfiguracoes';
import { HomePage } from './pages/HomePage'; // <--- NOVO IMPORT

export function App() {
  return (
    <HabitsProvider>
      <div className={styles.container}>
        <div className={styles.content}>
          
          <Header /> 

          <Routes>
            {/* Rota Home: AGORA APONTA PARA A NOVA HOME PAGE */}
            <Route path="/" element={<HomePage />} /> 
            
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