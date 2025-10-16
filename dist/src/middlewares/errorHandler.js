"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Ocurrió un error inesperado en el servidor bancario.';
    res.status(status).json({ message, details: err.details });
};
exports.errorHandler = errorHandler;
