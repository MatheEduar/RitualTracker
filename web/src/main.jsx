// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'

// NOVO: Importar Browser Router
import { BrowserRouter } from 'react-router-dom';

// IMPORTANTE: Importar a configuração do dayjs aqui para valer no app todo
import './lib/dayjs' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Envolvemos o App com o Router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)