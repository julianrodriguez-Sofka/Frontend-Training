"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAccounts = exports.updateAccount = exports.findAccountDetails = exports.register = void 0;
const apiClient_1 = __importDefault(require("./apiClient"));
const register = async (user) => {
    try {
        const response = await apiClient_1.default.post('/users/register', user);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};
exports.register = register;
const findAccountDetails = async (accountId) => {
    try {
        const response = await apiClient_1.default.get(`/accounts/${accountId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};
exports.findAccountDetails = findAccountDetails;
const updateAccount = async (accountId, data) => {
    try {
        const response = await apiClient_1.default.put(`/accounts/${accountId}`, data);
        return response.data;
    }
    catch (error) {
        throw error;
    }
};
exports.updateAccount = updateAccount;
const listAccounts = async () => {
    try {
        const response = await apiClient_1.default.get('/accounts');
        return response.data;
    }
    catch (error) {
        throw error;
    }
};
exports.listAccounts = listAccounts;
