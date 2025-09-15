import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Change this to your deployed backend URL later

export function fetchItems() {
  return axios.get(`${API_URL}/items`);
}

export function createItem(item) {
  return axios.post(`${API_URL}/items`, item);
}
