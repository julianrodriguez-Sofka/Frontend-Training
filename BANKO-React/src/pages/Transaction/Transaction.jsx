import React, { useState } from "react";
import "./Transaction.css"; 
const Transaction = () => {
  const [formData, setFormData] = useState({
    recipientDni: "",
    accountNumber: "",
    amount: "",
    description: "",
  });

  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleTransfer = (amount, recipientDni) => {
    if (amount > 0 && recipientDni.trim() !== "") {
      return { success: true };
    } else {
      return { success: false, message: "Verifica los datos de la transacción." };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { amount, recipientDni } = formData;
    const parsedAmount = parseFloat(amount);

    if (parsedAmount > 0 && recipientDni.trim() !== "") {
      try {
        
        const result = handleTransfer(parsedAmount, recipientDni);

        if (result.success) {
          setIsSuccess(true);
          setMessage(
            `✅ Transferencia de $${parsedAmount.toFixed(2)} enviada con éxito a DNI ${recipientDni}.`
          );

          setFormData({
            recipientDni: "",
            accountNumber: "",
            amount: "",
            description: "",
          });

          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        } else {
          setIsSuccess(false);
          setMessage(result.message);
        }
      } catch (error) {
        console.error("Error en la transferencia:", error);
        setIsSuccess(false);
        setMessage("❌ Error en la operación. Intenta nuevamente.");
      }
    } else {
      setIsSuccess(false);
      setMessage("⚠️ Verifica el monto y el DNI del destinatario.");
    }
  };

  return (
    <>
      {/* 🔹 Navbar superior */}
      <nav className="navbar">
        <div className="logo">
          <a href="/dashboard">BANKO</a>
        </div>
        <div>
          <a href="/dashboard">Volver al Dashboard</a>
        </div>
      </nav>

      {/* 🔹 Contenedor principal */}
      <div className="container" style={{ maxWidth: "600px" }}>
        <div className="card">
          <h2 style={{ color: "var(--color-primary)", marginBottom: "1.5rem" }}>
            Transferencia a Terceros
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="recipientDni">DNI del Destinatario</label>
              <input
                type="text"
                id="recipientDni"
                required
                placeholder="Identificación del beneficiario"
                value={formData.recipientDni}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="accountNumber">Número de Cuenta Destino</label>
              <input
                type="text"
                id="accountNumber"
                required
                placeholder="Ej: 001-987-654-3"
                value={formData.accountNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Monto a Transferir ($)</label>
              <input
                type="number"
                id="amount"
                required
                min="1.00"
                step="0.01"
                placeholder="Ej: 500.00"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Concepto/Descripción</label>
              <input
                type="text"
                id="description"
                placeholder="Ej: Pago de renta"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Confirmar Transacción
            </button>
          </form>

          {/* 🔹 Mensaje dinámico */}
          {message && (
            <p
              style={{
                marginTop: "1rem",
                textAlign: "center",
                color: isSuccess ? "green" : "red",
                fontWeight: 500,
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Transaction;

