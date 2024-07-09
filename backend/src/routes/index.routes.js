"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Enrutador de usuarios  */
import userRoutes from "./user.routes.js";

/** Enrutador de autenticación */
import authRoutes from "./auth.routes.js";

/** Enrutador de incripcion de usuarios */
import inscripcionesRoutes from "./inscripciones.routes.js";

/** Enrutador de creacion de eventos */
import eventoRoutes from "./evento.routes.js"

/** Enrutador de emprendedores */
import emprendedorRoutes from "./emprendedor.routes.js"

/*Enrutador de productos*/
import productRoutes from "./productos.routes.js";

/** Enrutador de asistentes */
import asistenteRoutes from "./asistente.routes.js"

// Se realiza una instancia de express
const router = Router();

// Define las rutas para los usuarios /api/user
router.use("/user",  userRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);
// Define las rutas para la creacion de eventos
router.use("/evento",eventoRoutes);
// Define las rutas para las incripcion a un evento
router.use('/inscripciones', inscripcionesRoutes);
// Define las rutas de emprendedor
router.use('/emprendedor', emprendedorRoutes);
// Define las rutas del usuario (asistente)
router.use('/asistente', asistenteRoutes);
// Define las rutas para los productos
router.use("/producto", productRoutes);

export default router;
