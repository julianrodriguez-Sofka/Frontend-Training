import apiClient from './apiClient';

export interface IRegisterUser {
    username: string;
    email: string;
    password: string;
    dni: string;
}

export interface IAccountDetail {
    accountId: string;
    ownerName: string;
    balance: number;
}

export interface ITransactionResult {
    message: string;
    transactionId: string;
}

export const register = async (user: IRegisterUser): Promise<void> => {
    try {
        const response = await apiClient.post('/users/register', user);
        // No return statement needed as the function returns void
    } catch (error) {
        throw error;
    }
};

export const findAccountDetails = async (accountId: string): Promise<any> => {
    try {
        const response = await apiClient.get<IAccountDetail>(`/accounts/${accountId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const updateAccount = async (accountId: string, data: Partial<IRegisterUser>): Promise<any> => {
    try {
        const response = await apiClient.put(`/accounts/${accountId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const listAccounts = async (): Promise<IAccountDetail[]> => {
    try {
        const response = await apiClient.get<IAccountDetail[]>('/accounts');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    updateAccount,
    listAccounts,
};