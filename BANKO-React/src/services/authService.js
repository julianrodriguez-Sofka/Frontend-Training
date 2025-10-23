import api from "../api/axiosConfig"; // tu instancia de Axios

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Usuario no encontrado en el sistema, por favor registrarse");
    }
    throw new Error(error.response?.data?.message || "Error al iniciar sesión");
  }
};


