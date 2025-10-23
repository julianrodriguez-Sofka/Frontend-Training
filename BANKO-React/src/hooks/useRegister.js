import { useState } from "react";
import { registerUser } from "../services/userService";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registerUser(formData);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "No se pudo registrar");
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error, success };
};
