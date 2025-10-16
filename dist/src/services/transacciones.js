"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTransactionsByAccount = exports.createTransaction = void 0;
const apiClient_1 = __importDefault(require("./apiClient"));
const createTransaction = async (transaction) => {
    try {
        const response = await apiClient_1.default.post('/transactions', transaction);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};
exports.createTransaction = createTransaction;
const listTransactionsByAccount = async (accountId) => {
    try {
        const response = await apiClient_1.default.get(`/transactions/account/${accountId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};
exports.listTransactionsByAccount = listTransactionsByAccount;
