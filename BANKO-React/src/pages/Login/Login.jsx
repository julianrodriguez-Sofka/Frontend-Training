import React, { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { handleLogin, loading, error, success } = useLogin();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("⚠️ Por favor completa todos los campos.");
      return;
    }

    const loggedIn = await handleLogin(formData);

    if (loggedIn) {
      // Si el login es exitoso, redirige al Dashboard
      setTimeout(() => (window.location.href = "/dashboard"), 1000);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <a href="/">BANKO</a>
        </div>
        <div>
          <a href="/register">Registrarse</a>
        </div>
      </nav>

      {/* Formulario de Login */}
      <div className="container" style={{ maxWidth: "450px" }}>
        <div className="card">
          <h2 style={{ color: "var(--color-primary)", marginBottom: "1.5rem" }}>
            Inicia Sesión
          </h2>

          <form onSubmit={handleSubmit}>
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
                placeholder="Tu contraseña"
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
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Mensajes dinámicos */}
          {error && (
            <p style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>
              ❌ {error}
            </p>
          )}
          {success && (
            <p
              style={{ color: "green", marginTop: "1rem", textAlign: "center" }}
            >
              ✅ Inicio de sesión exitoso
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;



