// src/App.jsx
import { Header } from './components/Header'; // Importamos a peça pronta
import styles from './App.module.css';
import './index.css';

export function App() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        
        {/* Aqui entra o nosso componente isolado */}
        <Header />

        {/* Placeholder para a futura tabela */}
        <div style={{ marginTop: '3rem' }}>
          <p>Aqui virá a tabela de hábitos...</p>
        </div>

      </div>
    </div>
  )
}