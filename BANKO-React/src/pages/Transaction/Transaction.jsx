import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Transaction.css";
import { transferMoney } from "../../services/transactionService";

export default function Transaction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sourceAccountNumber: "",
    destinationAccountNumber: "",
    amount: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Recupera usuario logeado
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/"); // Si no hay usuario, redirige al login
      return;
    }
    setUser(storedUser);
    setFormData((prev) => ({
      ...prev,
      sourceAccountNumber: storedUser.accountNumber,
    }));
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await transferMoney(formData);
      console.log("Transferencia exitosa:", response);
      setMessage("✅ Transferencia realizada con éxito");
      setFormData({
        ...formData,
        destinationAccountNumber: "",
        amount: "",
      });
    } catch (error) {
      console.error("Error al transferir:", error);
      setMessage("❌ Error al realizar la transferencia. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

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
          Realizar Transacción
        </h1>

        <form className="transaction-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cuenta de origen</label>
            <input
              type="text"
              name="sourceAccountNumber"
              value={formData.sourceAccountNumber}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Cuenta destino</label>
            <input
              type="text"
              name="destinationAccountNumber"
              value={formData.destinationAccountNumber}
              onChange={handleChange}
              placeholder="Ej: 001-456-789-0"
              required
            />
          </div>

          <div className="form-group">
            <label>Monto</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Ej: 500.00"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Procesando..." : "Transferir"}
          </button>
        </form>

        {message && <p className="transaction-message">{message}</p>}
      </div>
    </div>
  );
}

