import axios from "axios";

const PRIMARY_URL = import.meta.env.VITE_PRIMARY_URL || 'https://testing-website-api.invitech.com.vn/';
const FALLBACK_URL = import.meta.env.VITE_FALLBACK_URL || 'http://192.168.4.74:2022/';

const api = axios.create({
    baseURL: PRIMARY_URL,
});

export default api;