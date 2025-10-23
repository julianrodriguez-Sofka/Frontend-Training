import React, { useState } from "react";
import "../styles/styles.css"; // ✅ corregido para apuntar a la carpeta "styles"
// Más adelante se importará esto cuando conectemos con el backend:
// import { registerUser } from "../utils/bankUtils";

const Register = () => {
  const [formData, setFormData] = useState({
    dni: "",
    username: "",
    email: "",
    password: "",
  });

  // 🔹 Maneja los cambios del formulario
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // 🔹 Simula el envío del registro (luego se reemplaza por la API)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dni || !formData.username || !formData.email || !formData.password) {
      alert("⚠️ Por favor completa todos los campos antes de continuar.");
      return;
    }

    try {
      console.log("Datos enviados al servidor (simulado):", formData);

      // Más adelante: await registerUser(formData);

      alert("✅ Registro exitoso (simulado). Redirigiendo al inicio de sesión...");
      setFormData({ dni: "", username: "", email: "", password: "" });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("❌ Ocurrió un error durante el registro.");
    }
  };

  return (
    <>
      {/* Barra de navegación */}
      <nav className="navbar">
        <div className="logo">
          <a href="/">BANKO</a>
        </div>
        <div>
          <a href="/login">Iniciar Sesión</a>
        </div>
      </nav>

      {/* Formulario de registro */}
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
            >
              Registrarse y Abrir Cuenta
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;

