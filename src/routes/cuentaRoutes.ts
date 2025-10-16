import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { register, findAccountDetails, IRegisterUser } from '../services/cuentas';
import { createTransaction, ITransaction } from '../services/transacciones';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Ruta principal de cuentas');
});

export default router;