// src/hooks/useRegister.js
import { useState } from "react";
import { registerUser } from "../services/userService.js";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registerUser(userData);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error, success };
};

