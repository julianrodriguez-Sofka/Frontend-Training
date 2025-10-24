import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { getUserById } from "../../services/userService";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser || !storedUser.id) {
        setError("No se encontró el usuario. Inicia sesión nuevamente.");
        setLoading(false);
        return;
      }

      const userData = await getUserById(storedUser.id);
      setUser(userData);

      // Si el usuario tiene cuentas bancarias, usa el saldo de la primera
      if (userData.bankAccounts && userData.bankAccounts.length > 0) {
        setBalance(userData.bankAccounts[0].balance || 0);
      }

    } catch (err) {
      console.error("❌ Error al cargar datos del usuario:", err);
      setError("No se pudieron cargar los datos del usuario.");
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, []);


  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: "5rem" }}>
        <h2 style={{ color: "var(--color-primary)" }}>Cargando tu panel...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: "5rem" }}>
        <h2 style={{ color: "red" }}>{error}</h2>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Ir al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Barra de navegación */}
      <nav className="navbar">
        <div className="logo">
          <Link to="/dashboard">BANKO</Link>
        </div>
        <div>
          <span style={{ marginRight: "1rem", color: "var(--color-text)" }}>
            👤 {user?.username || "Usuario"}
          </span>
          <Link to="/" onClick={() => localStorage.clear()}>
            Cerrar Sesión
          </Link>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="container">
        <header>
          <h1 style={{ color: "var(--color-primary)", marginBottom: "2rem" }}>
            Panel de Control
          </h1>
        </header>

        <div className="balance-card">
          <h2>Saldo Disponible</h2>
          <p id="displayBalance">$ {balance.toFixed(2)}</p>
          <span style={{ opacity: 0.7 }}>
            Cuenta Nº:{" "}
            {user?.bankAccounts && user.bankAccounts.length > 0
              ? user.bankAccounts[0].accountNumber
              : "Sin cuenta registrada"}
          </span>
        </div>

        <h2 style={{ marginBottom: "1rem", color: "var(--color-text)" }}>
          Operaciones Rápidas
        </h2>

        <div className="actions-grid">
          <Link to="/transaction" className="action-item">
            <div className="icon">💸</div>
            <h3>Realizar Transacción</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Enviar dinero a otra cuenta.
            </p>
          </Link>

          <Link to="/atm" className="action-item">
            <div className="icon">🏧</div>
            <h3>Cajero Automático</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Depósitos y retiros rápidos.
            </p>
          </Link>

          <Link to="/history" className="action-item">
            <div className="icon">📜</div>
            <h3>Ver Historial</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Revisar movimientos pasados.
            </p>
          </Link>

          <Link to="/profile" className="action-item">
            <div className="icon">🏦</div>
            <h3>Modificar Perfil</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              Cambiar DNI, email o contraseña.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}


