import axios from "axios";

const PRIMARY_URL = import.meta.env.VITE_PRIMARY_URL || 'http://100.113.186.28:8000/';

const api = axios.create({
    baseURL: PRIMARY_URL,
});

export default api;