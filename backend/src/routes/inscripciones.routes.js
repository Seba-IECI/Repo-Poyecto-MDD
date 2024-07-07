import { Router } from "express";
import { crearIncripcion, obtenerInscripcion, actualizarInscripcion, eliminarInscripcion } from "../controllers/inscripciones.controller.js";

const router = Router();

//Ruta para crear formulario
router.post('/', crearIncripcion);

//Ruta para obtener todos los formularios
router.get('/:id', obtenerInscripcion);

//Ruta para modificar un formulario
router.put('/:id', actualizarInscripcion);

//Ruta para eliminar un formulario
router.delete('/:id', eliminarInscripcion);

export default router;