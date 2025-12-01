// src/lib/dayjs.js
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'; // Importa o idioma português
import utc from 'dayjs/plugin/utc'; // Plugin para lidar com horário Zulu (Greenwich)
import timezone from 'dayjs/plugin/timezone'; // Plugin para lidar com fusos

// Aplica as configurações
dayjs.locale('pt-br');
dayjs.extend(utc);
dayjs.extend(timezone);