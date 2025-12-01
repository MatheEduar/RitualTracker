// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'

// IMPORTANTE: Importar a configuração do dayjs aqui para valer no app todo
import './lib/dayjs' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)