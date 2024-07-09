import { Router } from 'express';
import { registrarAsistencia } from '../controllers/asistente.controller.js';

const router = Router();

// Ruta para registrar asistentes
router.post('/registrarAsistencia', registrarAsistencia);

export default router;