import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to include the auth token if available
api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');
        if (token) {
            // Defensive: Remove "Bearer " if it was stored with it
            if (token.startsWith('Bearer ')) {
                token = token.substring(7);
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle invalid tokens
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If error is 500 (Invalid Token) or 401/403, and we have a token, clear it
        if (error.response && (error.response.status === 500 || error.response.status === 401 || error.response.status === 403)) {
            const token = localStorage.getItem('token');
            if (token) {
                console.warn("Invalid Token detected. Clearing session.");
                localStorage.removeItem('token');
                // Optional: Redirect to login or reload
                // window.location.href = '/login'; 
            }
        }
        return Promise.reject(error);
    }
);

export default api;
