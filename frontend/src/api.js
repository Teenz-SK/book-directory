import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://book-directory-backend-ofng.onrender.com' // Important
});
