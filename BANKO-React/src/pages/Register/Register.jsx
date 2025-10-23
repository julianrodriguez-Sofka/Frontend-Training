import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useRegister";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    dni: "",
    username: "",
    email: "",
    password: "",
  });

  const { handleRegister, loading, error, success } = useRegister();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dni || !formData.username || !formData.email || !formData.password) {
      alert("⚠️ Por favor completa todos los campos antes de continuar.");
      return;
    }

    await handleRegister(formData);
  };

  // ✅ Redirige automáticamente cuando el registro fue exitoso
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate("/login", { state: { fromRegister: true } });
      }, 1000);
    }
  }, [success, navigate]);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <a href="/">BANKO</a>
        </div>
        <div>
          <a href="/login">Iniciar Sesión</a>
        </div>
      </nav>

      {/* Formulario */}
      <div className="container" style={{ maxWidth: "500px" }}>
        <div className="card">
          <h2 style={{ color: "var(--color-primary)", marginBottom: "1.5rem" }}>
            Crea tu Cuenta Bancaria
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="dni">DNI / Identificación</label>
              <input
                type="text"
                id="dni"
                required
                placeholder="Ej: 12345678X"
                value={formData.dni}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Nombre de Usuario</label>
              <input
                type="text"
                id="username"
                required
                placeholder="Ej: JulianR"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                required
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                required
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrarse y Abrir Cuenta"}
            </button>
          </form>

          {/* Mensajes de estado */}
          {error && <p style={{ color: "red", marginTop: "1rem" }}>❌ {error}</p>}
          {success && <p style={{ color: "green", marginTop: "1rem" }}>✅ Registro exitoso</p>}
        </div>
      </div>
    </>
  );
};

export default Register;

