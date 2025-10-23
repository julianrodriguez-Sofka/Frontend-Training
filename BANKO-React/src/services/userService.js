// src/services/userService.js
import api from "../api/axiosConfig";

/**
 * Registrar un nuevo usuario en el sistema
 * @param {Object} userData - Datos del usuario (dni, username, email, password)
 * @returns {Promise<Object>} - Respuesta con los datos del usuario registrado
 */
export const registerUser = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

/**
 * Obtener los datos de un usuario por su ID
 * @param {number|string} userId - ID del usuario
 * @returns {Promise<Object>} - Datos del usuario desde la API
 */
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    throw error;
  }
};

/**
 * Obtener la lista completa de usuarios (solo si es necesario)
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener la lista de usuarios:", error);
    throw error;
  }
};

