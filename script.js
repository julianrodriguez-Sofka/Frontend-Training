
const getBalance = () => {
    const balance = localStorage.getItem('bankBalance');
    return parseFloat(balance) || 1000.00;
};

const setBalance = (newBalance) => {
    localStorage.setItem('bankBalance', newBalance.toFixed(2));
};

const getHistory = () => {
    const history = localStorage.getItem('transactionHistory');
    return JSON.parse(history) || [];
};

const saveHistory = (history) => {
    localStorage.setItem('transactionHistory', JSON.stringify(history));
};

const recordTransaction = (type, amount, description) => {
    const history = getHistory();
    const newTransaction = {
        date: new Date().toLocaleDateString('es-ES'),
        type: type, 
        description: description,
        amount: parseFloat(amount).toFixed(2)
    };
    history.unshift(newTransaction);
    saveHistory(history);
};

const handleDeposit = (amount) => {
    let currentBalance = getBalance();
    const newBalance = currentBalance + amount;
    setBalance(newBalance);
    recordTransaction('Depósito', amount, 'Depósito en Cajero Automático');
    return newBalance;
};

const handleWithdrawal = (amount) => {
    let currentBalance = getBalance();
    if (currentBalance >= amount) {
        const newBalance = currentBalance - amount;
        setBalance(newBalance);
        recordTransaction('Retiro', -amount, 'Retiro de Cajero Automático');
        return { success: true, newBalance };
    } else {
        return { success: false, message: 'Saldo insuficiente para el retiro.' };
    }
};

const handleTransfer = (amount, recipientDni) => {
    let currentBalance = getBalance();
    if (currentBalance >= amount) {
        const newBalance = currentBalance - amount;
        setBalance(newBalance);
        recordTransaction('Transferencia', -amount, `Transferencia a DNI: ${recipientDni}`);
        return { success: true, newBalance };
    } else {
        return { success: false, message: 'Saldo insuficiente para la transferencia.' };
    }
};

const animateBalanceChange = (elementId, newBalance) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.opacity = 0;
        setTimeout(() => {
            element.innerText = `$ ${newBalance.toFixed(2)}`;
            element.style.opacity = 1;
        }, 300);
    }
};

const showAlert = (message, isSuccess = true) => {
    const alertBox = document.createElement('div');
    alertBox.className = `alert ${isSuccess ? 'alert-success' : 'alert-error'}`;
    alertBox.innerText = message;
    
    alertBox.style.opacity = 0;
    alertBox.style.transition = 'opacity 0.3s, transform 0.3s';
    alertBox.style.position = 'fixed';
    alertBox.style.top = '20px';
    alertBox.style.right = '20px';
    alertBox.style.padding = '15px';
    alertBox.style.borderRadius = '5px';
    alertBox.style.zIndex = '10000';
    alertBox.style.backgroundColor = isSuccess ? '#d4edda' : '#f8d7da';
    alertBox.style.color = isSuccess ? '#155724' : '#721c24';
    alertBox.style.border = isSuccess ? '1px solid #c3e6cb' : '1px solid #f5c6cb';

    document.body.appendChild(alertBox);
    
    setTimeout(() => { alertBox.style.opacity = 1; }, 10);

    setTimeout(() => { 
        alertBox.style.opacity = 0;
        alertBox.style.transform = 'translateY(-20px)';
    }, 4000);
    setTimeout(() => { document.body.removeChild(alertBox); }, 4500);
};