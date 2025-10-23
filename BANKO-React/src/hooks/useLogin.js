// src/hooks/useLogin.js
import { useState } from "react";
import { loginUser } from "../services/authService";
import { getUserById } from "../services/userService";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // 1) Llamada al endpoint de auth
      const loginResp = await loginUser(credentials);
      // loginResp debe contener al menos: id, username, email, message
      console.log("Respuesta login:", loginResp);

      // 2) Obtener usuario completo (para traer la/s cuentas y accountNumber)
      // Si tu login ya incluye bankAccounts, esta llamada puede omitirse.
      const userId = loginResp.id;
      const fullUser = await getUserById(userId);

      // Extraer accountNumber del primer bankAccount (si existe)
      const accountNumber = fullUser?.bankAccounts?.[0]?.accountNumber || null;

      // 3) Guardar objeto de sesión en localStorage
      const userToStore = {
        id: fullUser.id,
        username: fullUser.username,
        email: fullUser.email,
        accountNumber,
        raw: fullUser // opcional: guardar toda la respuesta
      };
      localStorage.setItem("user", JSON.stringify(userToStore));

      setSuccess(true);
      return { ok: true, user: userToStore };
    } catch (err) {
      console.error("Error en login:", err);

      if (err.response?.status === 404) {
        setError("Usuario no encontrado en el sistema. Por favor registrarse.");
      } else if (err.response?.status === 400 || err.response?.status === 401) {
        setError("Credenciales incorrectas.");
      } else {
        setError("Error al iniciar sesión. Intenta nuevamente.");
      }

      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error, success };
};
