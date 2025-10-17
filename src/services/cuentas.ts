// src/services/cuentas.ts
import { apiRequest } from './apiClient';

// --- INTERFACES DE DATOS ---
export interface ILoginUser {
    email: string;
    password: string;
}

export interface IRegisterUser extends ILoginUser {
    username: string;
    dni: string;
}

export interface IAuthResponse {
    token: string;
    accountId: string;
}

interface IBackendError {
    message?: string;
}

// --- FUNCIÓN DE REGISTRO ---
export const register = async (user: IRegisterUser): Promise<void> => {
    const endpoint = '/api/users/register';
    console.log('📝 Enviando registro al backend:', endpoint, 'con datos:', user);

    try {
        const response = await apiRequest<any>(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        console.log('✅ Registro exitoso. Respuesta del backend:', response);
    } catch (error: any) {
        console.error('💥 Error en register():', error.message || error);
        throw new Error(
            (error as IBackendError)?.message ||
            'Error desconocido al registrar usuario.'
        );
    }
};

// --- FUNCIÓN DE LOGIN ---
export const login = async (credentials: ILoginUser): Promise<IAuthResponse> => {
    const endpoint = '/api/users/login';
    console.log('🔑 Enviando login al backend:', endpoint, credentials);

    try {
        const response = await apiRequest<IAuthResponse>(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });

        console.log('✅ Login exitoso. Respuesta:', response);
        return response;
    } catch (error: any) {
        console.error('💥 Error en login():', error.message || error);
        throw new Error(
            (error as IBackendError)?.message || 'Error al iniciar sesión.'
        );
    }
};


