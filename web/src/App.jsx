import { useState, useEffect } from 'react'; // 1. Importe os Hooks
import { Header } from './components/Header';
import { SummaryTable } from './components/SummaryTable';
import { api } from './lib/axios'; // 2. Importe nossa configuração do Axios
import styles from './App.module.css';
import './index.css';

import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';

dayjs.locale('pt-br');

export function App() {
  // Estado para armazenar os hábitos (Memória do componente)
  // Começa como um array vazio []
  // setHabits é a função que usamos para atualizar essa memória
  const [habits, setHabits] = useState([]);

  // useEffect: O "Efeito Colateral"
  // O array vazio [] no final significa: "Execute isso APENAS uma vez, quando a tela carregar".
  useEffect(() => {
    // Chamada para a API
    api.get('/habits').then(response => {
      // Quando a resposta chegar...
      console.log('Dados recebidos do Backend:', response.data);
      setHabits(response.data); // Guarda na memória
    });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Header />
        <SummaryTable />
        
        {/* Depuração Provisória: Vamos listar os nomes só para ver se funcionou */}
        <div style={{ marginTop: '2rem', color: '#ccc' }}>
          <h3>Teste de Conexão:</h3>
          <ul>
            {habits.map(habit => (
              <li key={habit.id}>{habit.title}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}