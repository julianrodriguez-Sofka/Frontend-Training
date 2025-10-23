// src/services/transactionService.js
import api from "../api/axiosConfig";

/**
 * Realiza una transferencia entre cuentas
 */
export const transferMoney = async (data) => {
  const response = await api.post("/transactions/transfer", data);
  return response.data;
};

/**
 * Obtiene el historial de transacciones por número de cuenta
 * @param {string} accountNumber - número de cuenta (ej: "001-456-789-0")
 */
export const getTransactionHistory = async (accountNumber) => {
  const response = await api.get(`/transactions/history/${accountNumber}`);
  return response.data;
};

