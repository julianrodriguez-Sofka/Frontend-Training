import apiClient from './apiClient';
export interface ITransaction {
    accountId: string;
    type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';
    amount: number;
    targetAccount?: string;
}

export const createTransaction = async (transaction: ITransaction): Promise<any> => {
    try {
        const response = await apiClient.post<IMovement>('/transactions', transaction);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export interface IMovement {
    transactionId: string;
    accountId: string;
    type: string;
    amount: number;
    timestamp: string;
}

const listTransactionsByAccount = async (accountId: string): Promise<IMovement[]> => {
    try {
        const response = await apiClient.get<IMovement[]>(`/transactions/account/${accountId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    listTransactionsByAccount,
};