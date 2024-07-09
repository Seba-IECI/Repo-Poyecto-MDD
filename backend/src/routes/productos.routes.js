'use strict';

import { Router } from 'express';
import { crearProducto, obtenerProductos, obtenerProductoPorID, modificarProductoPorID, modificarAtributoProductoPorID ,eliminarProductoPorID, buscarProductos } from '../controllers/productos.controller.js';
import { isEmprendedor } from "../middlewares/auth.middleware.js"

const router = Router();

// Buscar producto
router.get('/buscarProducto', buscarProductos);

// Proteger todas las rutas con middleware de autenticaciÃ³n de emprendedor
router.use(isEmprendedor);
// Crear un nuevo producto
router.post('/crear', crearProducto);
// Obtener todos los productos
router.get('/obtenerTodos', obtenerProductos);
// Obtener solo un producto por ID
router.get('/obtener1/:id', obtenerProductoPorID);
// (PUT) Modificar o actualizar todos los atributos de un producto 
router.put('/modificar/:id', modificarProductoPorID);
// (PATCH) Modificar o actualizar un solo atributo de un producto
router.patch('/modificarAtributo/:id', modificarAtributoProductoPorID);
// Eliminar un producto
router.delete('/eliminar/:id', eliminarProductoPorID);

export default router;