import React, { useEffect, useState } from "react";
import { getHistory } from "../utils/bankUtils"; // función real del sistema
import "../styles/styles.css"; // ruta correcta a la hoja de estilos

const History = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const data = getHistory(); // obtiene transacciones desde localStorage
    setTransactions(data);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <a href="/dashboard">BANKO</a>
        </div>
        <div>
          <a href="/dashboard">Volver al Dashboard</a>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ color: "var(--color-primary)", marginBottom: "2rem" }}>
          Historial de Movimientos
        </h1>

        <div className="card" style={{ padding: "1rem" }}>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Tipo</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      opacity: 0.7,
                      padding: "20px",
                    }}
                  >
                    Aún no hay transacciones registradas.
                  </td>
                </tr>
              ) : (
                transactions.map((tx, index) => {
                  const isCredit = parseFloat(tx.amount) >= 0;
                  const amountClass = isCredit ? "credit" : "debit";
                  const sign = isCredit ? "+ " : "- ";
                  const displayAmount = Math.abs(tx.amount).toFixed(2);

                  return (
                    <tr key={index}>
                      <td>{tx.date}</td>
                      <td>{tx.description}</td>
                      <td>{tx.type}</td>
                      <td className={amountClass}>
                        {sign}${displayAmount}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default History;

