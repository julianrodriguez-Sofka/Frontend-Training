// src/utils/bankUtils.js

// --- Balance management ---
export const getBalance = () => {
  const balance = localStorage.getItem("bankBalance");
  return parseFloat(balance) || 1000.0;
};

export const setBalance = (newBalance) => {
  localStorage.setItem("bankBalance", newBalance.toFixed(2));
};

// --- Transaction history ---
export const getHistory = () => {
  const history = localStorage.getItem("transactionHistory");
  return JSON.parse(history) || [];
};

export const saveHistory = (history) => {
  localStorage.setItem("transactionHistory", JSON.stringify(history));
};

// --- Record transactions ---
export const recordTransaction = (type, amount, description) => {
  const history = getHistory();
  const newTransaction = {
    date: new Date().toLocaleDateString("es-ES"),
    type,
    description,
    amount: parseFloat(amount).toFixed(2),
  };
  history.unshift(newTransaction);
  saveHistory(history);
};

// --- Deposit ---
export const handleDeposit = (amount) => {
  let currentBalance = getBalance();
  const newBalance = currentBalance + amount;
  setBalance(newBalance);
  recordTransaction("Depósito", amount, "Depósito en Cajero Automático");
  return newBalance;
};

// --- Withdrawal ---
export const handleWithdrawal = (amount) => {
  let currentBalance = getBalance();
  if (currentBalance >= amount) {
    const newBalance = currentBalance - amount;
    setBalance(newBalance);
    recordTransaction("Retiro", -amount, "Retiro de Cajero Automático");
    return { success: true, newBalance };
  } else {
    return { success: false, message: "Saldo insuficiente para el retiro." };
  }
};

// --- Transfer ---
export const handleTransfer = (amount, recipientDni) => {
  let currentBalance = getBalance();
  if (currentBalance >= amount) {
    const newBalance = currentBalance - amount;
    setBalance(newBalance);
    recordTransaction(
      "Transferencia",
      -amount,
      `Transferencia a DNI: ${recipientDni}`
    );
    return { success: true, newBalance };
  } else {
    return { success: false, message: "Saldo insuficiente para la transferencia." };
  }
};

// --- React-friendly Alert ---
export const showAlert = (setAlert, message, isSuccess = true) => {
  setAlert({ message, type: isSuccess ? "success" : "error" });
  setTimeout(() => setAlert(null), 4000);
};
