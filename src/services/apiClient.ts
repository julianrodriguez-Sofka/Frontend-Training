// src/services/apiClient.ts
import * as dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
if (!API_BASE_URL) {
    throw new Error('❌ La variable de entorno API_BASE_URL no está configurada.');
}

function headersToObject(headers?: HeadersInit): Record<string, string> {
    if (!headers) return {};
    if (typeof Headers !== 'undefined' && headers instanceof Headers) {
        const obj: Record<string, string> = {};
        headers.forEach((v, k) => (obj[k] = v));
        return obj;
    }
    if (Array.isArray(headers)) {
        const obj: Record<string, string> = {};
        for (const [k, v] of headers) obj[k] = v;
        return obj;
    }
    return headers as Record<string, string>;
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        if (typeof fetch === 'undefined') {
            throw new Error('fetch no está disponible en este entorno. Usa Node 18+ o instala node-fetch.');
        }

        let token: string | null = null;
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') || sessionStorage.getItem('token') || null;
        }

        const incoming = headersToObject(options.headers);
        const headersObj: Record<string, string> = {
            'Content-Type': 'application/json',
            ...incoming,
        };

        if (token) {
            headersObj['Authorization'] = `Bearer ${token}`;
            console.log('🔐 Token incluido en headers');
        }

        console.log(`🌍 Fetch -> ${url} [${options.method || 'GET'}]`);

        const response = await fetch(url, {
            ...options,
            headers: headersObj,
        });

        const text = await response.text();
        let data: any = null;
        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            console.warn('⚠️ Respuesta no es JSON, usando texto plano.');
            data = text;
        }

        if (!response.ok) {
            const message =
                typeof data === 'object' && data?.message
                    ? data.message
                    : `Error HTTP ${response.status}: ${text}`;
            console.error('❌ Error backend:', message);
            throw new Error(message);
        }

        console.log(`✅ Respuesta ${response.status} <-`, data);
        return data as T;
    } catch (err) {
        console.error('💥 Error en apiRequest:', err);
        throw err;
    }
}




