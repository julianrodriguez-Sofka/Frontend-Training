import express, { Router, Request, Response } from 'express';
import path from 'path';
import { register, login, IRegisterUser, ILoginUser } from '../services/cuentas';
import { createTransaction, ITransaction } from '../services/transacciones';

const router: Router = express.Router();

// --- Función auxiliar para limpiar mensajes ---
const formatMessage = (message: string) => message.replace(/\s/g, '_');

// --- VISTAS PÚBLICAS ---
router.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'login.html'));
});

router.get('/register', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'register.html'));
});

// --- VISTAS PROTEGIDAS ---
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'dashboard.html'));
});

router.get('/transaction', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'transaction.html'));
});

router.get('/atm_simulator', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'atm_simulator.html'));
});

router.get('/profile_settings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'profile_settings.html'));
});

// --- REGISTRO DE USUARIO ---
router.post('/register', async (req: Request, res: Response) => {
    console.log('📩 POST /register recibido en frontend con body:', req.body);

    try {
        const { username, email, dni, password } = req.body as IRegisterUser;

        // 🔍 Log para verificar conexión al backend
        console.log('🌍 Enviando registro al backend...');
        await register({ username, email, dni, password });
        console.log('✅ Usuario registrado correctamente en backend');

        const successMsg = formatMessage('Registro exitoso. Por favor, inicia sesión.');
        return res.redirect(`/?success=${successMsg}`);
    } catch (error: any) {
        console.error('❌ Error en /register frontend:', error.message);
        const errorMsg = formatMessage(error.message || 'Error desconocido al registrar usuario.');
        return res.redirect(`/register?error=${errorMsg}`);
    }
});

// --- LOGIN ---
router.post('/login', async (req: Request, res: Response) => {
    console.log('📩 POST /login recibido en frontend con body:', req.body);

    try {
        const { email, password } = req.body as ILoginUser;

        console.log('🌍 Enviando login al backend...');
        const authData = await login({ email, password });
        console.log('✅ Login exitoso. Token recibido:', authData.token);

        const successMsg = formatMessage('Inicio de sesión exitoso.');
        return res.redirect(`/dashboard?success=${successMsg}`);
    } catch (error: any) {
        console.error('❌ Error en /login frontend:', error.message);
        const errorMsg = formatMessage(error.message || 'Credenciales inválidas.');
        return res.redirect(`/?error=${errorMsg}`);
    }
});

// --- TRANSACCIONES ---
router.post('/transaction', async (req: Request, res: Response) => {
    console.log('📩 POST /transaction recibido con body:', req.body);

    try {
        const { accountId, type, amount, targetAccount } = req.body as ITransaction;

        console.log('🌍 Enviando transacción al backend...');
        await createTransaction({ accountId, type, amount, targetAccount });
        console.log('✅ Transacción registrada correctamente');

        const successMsg = formatMessage(`${type} realizado con éxito por $${amount}.`);
        return res.redirect(`/dashboard?success=${successMsg}`);
    } catch (error: any) {
        console.error('❌ Error en /transaction frontend:', error.message);
        const errorMsg = formatMessage(error.message || 'Error al procesar la transacción.');
        return res.redirect(`/dashboard?error=${errorMsg}`);
    }
});

export default router;
