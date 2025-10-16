import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    status?: number;
    details?: any; 
}

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const status = err.status || 500;
    const message = err.message || 'Ocurrió un error inesperado en el servidor bancario.';

    res.status(status).json({ message, details: err.details });
};