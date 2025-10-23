import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./History.css";
import { getTransactionHistory } from "../../services/historyService";

export default function History() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/");
      return;
    }
    setUser(storedUser);

    const fetchHistory = async () => {
      try {
        const response = await getTransactionHistory(storedUser.accountNumber);
        setTransactions(response);
      } catch (error) {
        console.error("Error al obtener historial:", error);
      }
    };

    fetchHistory();
  }, [navigate]);

  return (
    <div>
      {/* NAV */}
      <nav className="navbar">
        <div className="logo">
          <Link to="/dashboard">BANKO</Link>
        </div>
        <div>
          <span>Perfil ({user?.username || "Usuario"})</span>
          <Link to="/">Cerrar Sesión</Link>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ color: "var(--color-primary)", marginBottom: "2rem" }}>
          Historial de Transacciones
        </h1>

        <div className="history-card">
          {transactions.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No hay transacciones registradas.</p>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Cuenta Destino</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{new Date(tx.transactionDate).toLocaleString()}</td>
                    <td>{tx.description}</td>
                    <td
                      style={{
                        color:
                          tx.sourceAccountNumber === user?.accountNumber
                            ? "red"
                            : "green",
                      }}
                    >
                      {tx.sourceAccountNumber === user?.accountNumber
                        ? `- $${tx.amount.toFixed(2)}`
                        : `+ $${tx.amount.toFixed(2)}`}
                    </td>
                    <td>{tx.targetAccountNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}


