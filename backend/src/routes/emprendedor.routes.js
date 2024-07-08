"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de emprendedor */
import { crearEmprendedor, emprendedorLogin, perfil,  modificarEmprendedor, obtenerEmprendedor, obtenerEmprendedores, eliminarEmprendedor } from "../controllers/emprendedor.controller.js";
import { isEmprendedor } from "../middlewares/auth.middleware.js";


// Se realiza una instancia de express
const router = Router();

// Define las rutas para los usuarios
router.post("/crearEmprendedor", crearEmprendedor);
router.post("/loginEmprendedor", emprendedorLogin);
router.get("/perfil", perfil);
router.put("/modificarEmprendedor", isEmprendedor, modificarEmprendedor);
router.get("/obtenerEmprendedor", obtenerEmprendedor);
router.get("/emprendedores", obtenerEmprendedores);
router.delete("/noEmprendedor", isEmprendedor, eliminarEmprendedor);

export default router;