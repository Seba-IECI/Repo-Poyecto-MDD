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

export default router;
