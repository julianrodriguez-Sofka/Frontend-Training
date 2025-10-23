import api from "../api/axiosConfig";

/**
 * Obtener el historial de transacciones (entrantes y salientes)
 * de una cuenta bancaria por su número de cuenta.
 *
 * @param {string} accountNumber - Número de cuenta del usuario logeado
 * @returns {Promise<Array>} - Lista de transacciones
 */
export const getTransactionHistory = async (accountNumber) => {
  try {
    const response = await api.get(`/transactions/history/${accountNumber}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener el historial de transacciones:", error);
    throw error;
  }
};
