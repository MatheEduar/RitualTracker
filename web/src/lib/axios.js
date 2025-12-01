// src/lib/axios.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333' // O endereço do seu Backend
});