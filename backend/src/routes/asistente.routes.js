// routes/asistente.routes.js
import { Router } from 'express';
import { registrarAsistencia, eliminarAsistencia } from '../controllers/asistente.controller.js';

const router = Router();

router.post('/registrarAsistencia', registrarAsistencia);
router.delete('/eliminarAsistencia', eliminarAsistencia);

export default router;