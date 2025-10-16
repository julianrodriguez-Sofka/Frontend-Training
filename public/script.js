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
    
    // Estilos para la alerta flotante
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