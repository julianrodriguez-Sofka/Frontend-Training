"use strict";
// app.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const errorHandler_1 = require("./src/middlewares/errorHandler");
const cuentaRoutes_1 = __importDefault(require("./src/routes/cuentaRoutes"));
// Cargar variables de entorno
dotenv.config();
const app = (0, express_1.default)();
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
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Archivos estáticos
app.use(express_1.default.static(path.join(__dirname, 'public')));
// Rutas
app.use('/', cuentaRoutes_1.default);
// Middleware de manejo de errores
app.use((err, req, res, next) => {
    (0, errorHandler_1.errorHandler)(err, req, res, next);
});
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Frontend Server Express (TS) corriendo en http://localhost:${PORT}`);
    console.log(`Conectado al Backend: ${API_BASE_URL}`);
    console.log(`Swagger disponible en: ${API_BASE_URL}/swagger-ui/index.html`);
});
