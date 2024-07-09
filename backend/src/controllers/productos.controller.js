"use strict";
import Evento from '../models/evento.model.js';
import Product from '../models/productos.model.js';

// Crear un nuevo producto
async function crearProducto(req, res) {
  try {
    const datosProducto = req.body; // Se crea una constante con los datos del producto (nombre, descripcion, precio, stock).
    const NuevoProducto = await Product.create(datosProducto);
    
    await Evento.findByIdAndUpdate(datosProducto.eventoId, {
        $push:{ inscripcionEmprendedor: { productos: NuevoProducto._id }}
    });
    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al crear el producto' });
    if (error.code === 11000) {
        res.status(400).json({
            message: "Ya estás inscrito en este evento."
        });
    } else {
        res.status(500).json({ message: error.message });
    }
  }
}

// Obtenre todos los productos
async function obtenerProductos(req, res) {
  try {
    const productos = await Product.find().exec();
    res.json(productos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
}

// Obtener un producto por ID
async function obtenerProductoPorID(req, res) {
  try {
    const id = req.params.id;
    const producto = await Product.findById(id).exec();
    if (!producto) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json(producto);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
}

// (PUT) Modificar todos los atributos de un producto
async function modificarProductoPorID(req, res) {
  try {
    const id = req.params.id;
    const producto = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!producto) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json({ message: 'Producto modificado exitosamente' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al modificar producto' });
  }
}

// (PATCH) Modificar un atributo de un producto
async function modificarAtributoProductoPorID(req, res) {
  try {
    const id = req.params.id;
    const atributo = req.body.atributo; // nombre del atributo a modificar
    const valor = req.body.valor; // nuevo valor del atributo
    const producto = await Product.findById(id).exec();
    if (!producto) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      producto[atributo] = valor; // modificar el atributo
      await producto.save(); // guardar los cambios
      res.json({ message: `Atributo ${atributo} modificado exitosamente` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al modificar atributo' });
  }
}

// Eliminar un producto
async function eliminarProductoPorID(req, res) {
  try {
    const id = req.params.id;
    const productoEliminado = await Product.findOneAndDelete({ _id: id }).exec(); 
    
    await Evento.findByIdAndDelete(Product.eventoId, {
        $pull:{ inscripcionEmprendedor: { productos: id}} 
    });

    if (!productoEliminado) {
      res.status(404).json({ message: 'Producto no encontrado' });
    } else {
      res.json({ message: 'Producto eliminado correctamente', producto: productoEliminado });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
}

export {  crearProducto, obtenerProductos, obtenerProductoPorID, modificarProductoPorID, modificarAtributoProductoPorID ,eliminarProductoPorID };