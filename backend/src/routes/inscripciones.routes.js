import { Router } from "express";
import { crearIncripcion, obtenerAsistentes, visualizarInscripciones, eliminarInscripcion } from "../controllers/inscripciones.controller.js";
import { isEmprendedor, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

//Ruta para crear inscribir un evento
router.post('/inscribir', isEmprendedor, crearIncripcion);

// Ruta para obtener todos los asistentes de un evento
router.get('/asistentes/:eventoId', isAdmin, obtenerAsistentes);

//Ruta para visualizar a los eventos que esta inscrito el emprendedor
router.get('/visualizar', isEmprendedor, visualizarInscripciones);

//Ruta para eliminar una inscripcion
router.delete('/eliminar/:id', isEmprendedor, eliminarInscripcion);

export default router;