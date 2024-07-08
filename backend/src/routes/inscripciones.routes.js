import { Router } from "express";
import { crearIncripcion, obtenerInscripcion, actualizarInscripcion, eliminarInscripcion } from "../controllers/inscripciones.controller.js";
import { isEmprendedor } from "../middlewares/auth.middleware.js";

const router = Router();

//Ruta para crear formulario
router.post('/inscribir', crearIncripcion);

//Ruta para obtener todos los formularios
router.get('/visualizar/:id', isEmprendedor, obtenerInscripcion);

//Ruta para modificar un formulario
router.put('/actualizar/:id', isEmprendedor, actualizarInscripcion);

//Ruta para eliminar un formulario
router.delete('/eliminar/:id', isEmprendedor, eliminarInscripcion);

export default router;