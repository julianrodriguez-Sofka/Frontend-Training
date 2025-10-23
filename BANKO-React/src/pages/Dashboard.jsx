import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";
import { getBalance, setBalance } from "../utils/bankUtils"; // ✅ importamos las funciones

export default function Dashboard() {
  const [balance, setBalanceState] = useState(0);

  useEffect(() => {
    // ✅ Obtener el balance desde bankUtils
    const currentBalance = getBalance();

    // Si no hay balance en localStorage, inicializa con uno
    if (!currentBalance) {
      const initialBalance = 12345.5;
      setBalance(initialBalance);
      setBalanceState(initialBalance);
    } else {
      setBalanceState(currentBalance);
    }
  }, []);

  return (
    <div>
      {/* Barra de navegación */}
      <nav className="navbar">
        <div className="logo">
          <Link to="/dashboard">BANKO</Link>
        </div>
        <div>
          <a href="#">Perfil (Usuario Test)</a>
          <Link to="/">Cerrar Sesión</Link>
        </div>
      </nav>

      <div className="container">
        <header>
          <h1 style={{ color: "var(--color-primary)", marginBottom: "2rem" }}>
            Panel de Control
          </h1>
        </header>

        <div className="balance-card">
          <h2>Saldo Disponible</h2>
          <p id="displayBalance">$ {balance.toFixed(2)}</p>
          <span style={{ opacity: 0.7 }}>Cuenta Nº: 001-456-789-0</span>
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
