import axios from 'axios';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error('La variable de entorno API_BASE_URL no está configurada.');
}

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    validateStatus: (status: number) => {
        return status >= 200 && status < 500;
    },
});

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: any) => {
        if (error.request && !error.response) {
            console.error('Error de red o el servidor no respondió.');
        }

        if (error.response) {
            console.error('Error en la respuesta del servidor:', error.response.data);
        }

        return Promise.reject(error);
    }
);

export default apiClient;