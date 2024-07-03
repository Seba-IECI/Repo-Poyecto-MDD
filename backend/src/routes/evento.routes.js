'use strict';
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";
// Importar funciones de controlador de eventos
import{ crearEvento, obtenerEventos, actulaizarEvento, eliminarEvento} from "../controllers/evento.controller.js"
// Importar middleware de autenticación de administrador
import { isAdmin } from "../middlewares/auth.middleware.js"

const router = Router();

// Proteger todas las rutas con middleware de autenticación de administrador
router.use(isAdmin);

router.post("/eventos", crearEvento);
router.get("/eventos", obtenerEventos);
router.put("/eventos/:id", actualizarEvento);
router.delete("/eventos/:id", eliminarEvento);

export default router;