// app.ts

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { errorHandler } from './src/middlewares/errorHandler';
import cuentaRoutes from './src/routes/cuentaRoutes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL;

// Validar que las variables de entorno críticas estén configuradas
if (!API_BASE_URL) {
    console.error('Error: La variable de entorno API_BASE_URL no está configurada.');
    process.exit(1); // Detener la ejecución si falta una variable crítica
}

// Configuración de vistas
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', cuentaRoutes);

// Middleware de manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Frontend Server Express (TS) corriendo en http://localhost:${PORT}`);
    console.log(`Conectado al Backend: ${API_BASE_URL}`);
    console.log(`Swagger disponible en: ${API_BASE_URL}/swagger-ui/index.html`);
});