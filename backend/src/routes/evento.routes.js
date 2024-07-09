'use strict';
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";
// Importar funciones de controlador de eventos
import{ crearEvento, obtenerEventos, actualizarEvento, eliminarEvento, buscarEvento, confirmarAsistencia} from "../controllers/evento.controller.js"
// Importar middleware de autenticación de administrador
import { isAdmin } from "../middlewares/auth.middleware.js"

const router = Router();

router.get("/buscar/:nombreEvento", buscarEvento);

// Proteger todas las rutas con middleware de autenticación de administrador
router.use(isAdmin);

router.post("/crearevento", crearEvento);
router.get("/obtener", obtenerEventos);
router.put("/update/:id", actualizarEvento);
router.delete("/delete/:id", eliminarEvento);
router.post("/confirmarAsistencia", confirmarAsistencia);

export default router;