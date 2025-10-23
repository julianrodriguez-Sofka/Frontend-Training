import React, { useState, useEffect } from "react";
import {
  getBalance,
  setBalance,
  handleDeposit,
  handleWithdrawal,
  recordTransaction,
  showAlert,
} from "../utils/bankUtils";
import "../styles/styles.css"; // ✅ Ruta correcta (asegúrate de que el archivo esté aquí)

const Corresponsal = () => {
  const [balance, setLocalBalance] = useState(0);
  const [pin, setPin] = useState(null);
  const [pinExpireTime, setPinExpireTime] = useState(null);

  useEffect(() => {
    // Cargar saldo inicial desde localStorage (simulando backend)
    setLocalBalance(getBalance());
  }, []);

  // 🔹 Genera un PIN aleatorio válido por 3 horas
  const generarPin = () => {
    const nuevoPin = Math.floor(100000 + Math.random() * 900000);
    const expiracion = Date.now() + 3 * 60 * 60 * 1000; // 3 horas
    setPin(nuevoPin);
    setPinExpireTime(expiracion);
    return nuevoPin;
  };

  // 🔹 DEPÓSITO
  const handleDeposito = (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.depositAmount.value);

    if (isNaN(amount) || amount <= 0) {
      showAlert("⚠️ El monto debe ser mayor a cero.", false);
      return;
    }

    const nuevoPin = generarPin();
    const nuevoBalance = handleDeposit(amount);
    setLocalBalance(nuevoBalance);
    recordTransaction("Depósito Corresponsal", amount, "Depósito autorizado en corresponsal");
    showAlert(
      `✅ Depósito de $${amount.toFixed(2)} generado. PIN ${nuevoPin} válido por 3 horas.`,
      true
    );
    e.target.reset();
  };

  // 🔹 RETIRO
  const handleRetiro = (e) => {
    e.preventDefault();
    const amount = parseFloat(e.target.withdrawAmount.value);
    const inputPin = e.target.withdrawPin.value;

    if (!pin || Date.now() > pinExpireTime) {
      showAlert("❌ No hay un PIN activo o ha expirado. Genera uno nuevo con un depósito.", false);
      return;
    }

    if (inputPin !== pin.toString()) {
      showAlert("⚠️ El PIN ingresado no es válido.", false);
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      showAlert("⚠️ El monto debe ser mayor a cero.", false);
      return;
    }

    const result = handleWithdrawal(amount);
    if (result.success) {
      setLocalBalance(result.newBalance);
      recordTransaction("Retiro Corresponsal", -amount, "Retiro en corresponsal autorizado");
      showAlert(`💰 Retiro de $${amount.toFixed(2)} completado correctamente.`, true);
      setPin(null);
      e.target.reset();
    } else {
      showAlert(result.message, false);
    }
  };

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

      <div className="container" style={{ maxWidth: "800px" }}>
        <h1
          style={{
            color: "var(--color-primary)",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Corresponsal Bancario – Depósitos y Retiros
        </h1>

        <div className="balance-card" style={{ padding: "1.5rem", marginBottom: 30 }}>
          <h2 style={{ fontSize: "1.1rem" }}>
            Tu Saldo Actual:{" "}
            <span id="currentBalance" style={{ fontSize: "1.8rem" }}>
              ${balance.toFixed(2)}
            </span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
          {/* DEPÓSITO */}
          <div className="card">
            <h3 style={{ color: "var(--color-success)", marginBottom: "1.5rem" }}>
              Realizar Depósito
            </h3>
            <form id="depositForm" onSubmit={handleDeposito}>
              <div className="form-group">
                <label htmlFor="depositAmount">Monto a Depositar ($)</label>
                <input
                  type="number"
                  name="depositAmount"
                  required
                  min="1.00"
                  step="0.01"
                  placeholder="Ej: 500.00"
                />
              </div>
              <div className="form-group">
                <label htmlFor="depositRef">Referencia (Opcional)</label>
                <input
                  type="text"
                  name="depositRef"
                  placeholder="Ej: Venta de artículo"
                />
              </div>
              <button type="submit" className="btn btn-success" style={{ width: "100%" }}>
                Generar PIN de Depósito
              </button>
            </form>
          </div>

          {/* RETIRO */}
          <div className="card">
            <h3 style={{ color: "var(--color-danger)", marginBottom: "1.5rem" }}>
              Realizar Retiro
            </h3>
            <form id="withdrawForm" onSubmit={handleRetiro}>
              <div className="form-group">
                <label htmlFor="withdrawAmount">Monto a Retirar ($)</label>
                <input
                  type="number"
                  name="withdrawAmount"
                  required
                  min="1.00"
                  step="0.01"
                  placeholder="Ej: 200.00"
                />
              </div>
              <div className="form-group">
                <label htmlFor="withdrawPin">PIN de Seguridad</label>
                <input
                  type="password"
                  name="withdrawPin"
                  required
                  placeholder="Tu PIN generado"
                />
              </div>
              <button type="submit" className="btn btn-danger" style={{ width: "100%" }}>
                Retirar Dinero
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Corresponsal;
