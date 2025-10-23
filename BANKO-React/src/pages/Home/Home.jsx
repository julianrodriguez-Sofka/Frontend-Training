import React, { useEffect, useState } from "react";
import "./Home.css"; 

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loader"></div>
        <p className="loading-text">Cargando, ten paciencia...</p>
      </div>
    );
  }

  return (
    <div id="mainContent">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">BANKO</div>
        <div>
          <a href="/login">Iniciar Sesión</a>
          <a
            href="/register"
            className="btn btn-primary"
            style={{ marginLeft: "10px" }}
          >
            Abrir Cuenta
          </a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Tu Banca Digital de Confianza, Sin Comisiones Ocultas.</h1>
          <p>
            Gestiona tus finanzas, realiza transacciones instantáneas y alcanza tus metas económicas
            con la plataforma más segura y eficiente.
          </p>
          <div className="hero-buttons">
            <a href="/register" className="btn btn-primary">
              Crear Cuenta Gratis
            </a>
            <a href="/login" className="btn btn-secondary">
              Acceso Cliente
            </a>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <div className="container">
        <h2
          style={{
            textAlign: "center",
            color: "var(--color-primary)",
            marginBottom: "3rem",
          }}
        >
          ¿Por qué elegir BANKO?
        </h2>

        <div className="features-grid">
          <div className="feature-item">
            <div className="icon">🛡️</div>
            <h3>Seguridad de Nivel Superior</h3>
            <p>
              Protección de datos y transacciones con cifrado avanzado. Tu tranquilidad es nuestra
              prioridad.
            </p>
          </div>

          <div className="feature-item">
            <div className="icon">⚡</div>
            <h3>Transacciones Instantáneas</h3>
            <p>
              Realiza pagos y transferencias a cualquier cuenta de forma rápida, eficiente y sin
              demoras.
            </p>
          </div>

          <div className="feature-item">
            <div className="icon">📱</div>
            <h3>Control Total Móvil</h3>
            <p>
              Accede a todas las funcionalidades, desde el Dashboard hasta el Cajero, donde sea que
              estés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

