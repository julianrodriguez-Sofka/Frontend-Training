import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AtmSimulator.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/accounts";

const AtmSimulator = () => {
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setError("No se encontró información del usuario logeado.");
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    axios
      .get(`${API_URL}/user/${parsedUser.id}`)
      .then((res) => {
        setAccount(res.data);

        const allTransactions = [
          ...(res.data.outgoingTransactions || []).map((t) => ({
            ...t,
            type: "Salida",
          })),
          ...(res.data.incomingTransactions || []).map((t) => ({
            ...t,
            type: "Entrada",
          })),
        ];

        const sorted = allTransactions
          .sort(
            (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
          )
          .slice(0, 5);

        setTransactions(sorted);
      })
      .catch(() => setError("No se pudo obtener la cuenta bancaria."))
      .finally(() => setLoading(false));
  }, []);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setMessage("");
    setError("");
  };

  const performOperation = async (operation) => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Ingrese un monto válido.");
      return;
    }

    const endpoint = `${API_URL}/${operation}`;
    const payload = {
      accountNumber: account.accountNumber,
      amount: parseFloat(amount),
    };

    try {
      const res = await axios.put(endpoint, payload);
      setAccount(res.data);
      setMessage(
        `${operation === "deposit" ? "Depósito" : "Retiro"} exitoso de $${amount}`
      );
      setAmount("");

      const newTransaction = {
        amount: parseFloat(amount),
        description:
          operation === "deposit"
            ? `Depósito a cuenta ${account.accountNumber}`
            : `Retiro de cuenta ${account.accountNumber}`,
        transactionDate: new Date().toISOString(),
        type: operation === "deposit" ? "Entrada" : "Salida",
      };

      setTransactions((prev) => [newTransaction, ...prev].slice(0, 5));
    } catch (err) {
      setError(
        operation === "withdraw"
          ? "Fondos insuficientes o error en el retiro."
          : "Error al realizar el depósito."
      );
    }
  };

  if (loading)
    return (
      <div className="atm-loading">
        <div className="loader"></div>
        <p>Cargando cajero...</p>
      </div>
    );

  if (error)
    return (
      <div className="atm-error">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button className="btn-bank" onClick={() => navigate("/dashboard")}>
          ← BANKO
        </button>
      </div>
    );

  return (
    <div className="atm-page">
      <div className="atm-container">
        <div className="atm-header">
          <button className="btn-bank" onClick={() => navigate("/dashboard")}>
            ← BANKO
          </button>
          <h1>💳 Simulador de Cajero</h1>
        </div>

        <div className="atm-card">
          <div className="atm-user-info">
            <span className="atm-user">👤 {user?.username || "Usuario"}</span>
            <p>
              <strong>N° de cuenta:</strong> {account.accountNumber}
            </p>
            <p>
              <strong>Saldo actual:</strong>{" "}
              <span className="atm-balance">${account.balance.toFixed(2)}</span>
            </p>
          </div>

          <div className="atm-input-section">
            <label>Monto a operar</label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Ingrese el monto"
            />
          </div>

          <div className="atm-actions">
            <button className="btn deposit" onClick={() => performOperation("deposit")}>
              Depositar
            </button>
            <button className="btn withdraw" onClick={() => performOperation("withdraw")}>
              Retirar
            </button>
          </div>

          {message && <p className="atm-success">{message}</p>}
          {error && <p className="atm-error-text">{error}</p>}

          <div className="atm-history">
            <h2>Historial reciente</h2>
            {transactions.length === 0 ? (
              <p className="empty-history">No hay movimientos aún.</p>
            ) : (
              <ul>
                {transactions.map((t, index) => (
                  <li key={index} className={`transaction ${t.type.toLowerCase()}`}>
                    <div className="transaction-info">
                      <span className="transaction-type">
                        {t.type === "Entrada" ? "⬆️ Depósito" : "⬇️ Retiro"}
                      </span>
                      <span className="transaction-date">
                        {new Date(t.transactionDate).toLocaleDateString("es-CO", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div
                      className={`transaction-amount ${
                        t.type === "Entrada" ? "in" : "out"
                      }`}
                    >
                      {t.type === "Entrada" ? "+" : "-"}${t.amount.toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtmSimulator;
