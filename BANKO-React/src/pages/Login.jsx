import React, { useState } from "react";
import "../styles/styles.css"; // ✅ ruta corregida

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔹 Simulación de login (luego conectaremos con la API)
    console.log("Intentando iniciar sesión con:", formData);

    if (formData.email && formData.password) {
      alert("✅ Inicio de sesión exitoso (simulado)");
      window.location.href = "/dashboard"; // redirección temporal
    } else {
      alert("❌ Por favor completa todos los campos");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <a href="/">BANKO</a>
        </div>
        <div>
          <a href="/register">Registrarse</a>
        </div>
      </nav>

      {/* FORMULARIO LOGIN */}
      <div className="container" style={{ maxWidth: "400px" }}>
        <div className="card">
          <h2
            style={{
              color: "var(--color-primary)",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Acceso a Clientes
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                required
                placeholder="tu.correo@banco.com"
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
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Iniciar Sesión
            </button>
          </form>

          <p
            style={{
              marginTop: "1rem",
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            ¿Aún no tienes cuenta?{" "}
            <a href="/register" style={{ color: "var(--color-secondary)" }}>
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;

