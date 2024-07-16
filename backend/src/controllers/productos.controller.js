"use strict";
import Evento from '../models/evento.model.js';
import Product from '../models/productos.model.js';
import Emprendedor from '../models/emprendedor.model.js';

// Crear un nuevo producto
async function crearProducto(req, res) {
  try {
    const datosProducto = req.body; // Se crea una constante con los datos del producto (nombre, descripcion, precio, stock).
    const eventoId = datosProducto.eventoId;
    const emprendedorId = datosProducto.emprendedorId;
    const nuevoProducto = new Product({
      eventoId,
      emprendedorId,
      nombre: datosProducto.nombre,
      descripcion: datosProducto.descripcion,
      precio: datosProducto.precio,
      stock: datosProducto.stock
    })

    await nuevoProducto.save();

    await Evento.findByIdAndUpdate(datosProducto.eventoId, {
      $push:{ inscripcionEmprendedor: { productos: nuevoProducto._id }}
  });

    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
        res.status(400).json({
            message: "Ya registraste este producto."
        });
    } else {
      res.status(500).json({ message: 'Error al crear el producto' });
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

async function buscarProductos(req, res) {
  try {
      const { eventoId, nombreProducto } = req.query;
      console.log('eventoId:', eventoId);
      console.log('nombreProducto:', nombreProducto);


      // Validar si el eventoId es válido
      const evento = await Evento.findById(eventoId);
      if (!evento) {
          return res.status(404).json({ msg: 'Evento no encontrado' });
      }

      // Buscar productos por nombre y eventoId
      const productos = await Product.find({eventoId: eventoId, nombre: { $regex: nombreProducto, $options: 'i' }}); // Busca productos cuyo nombre contenga la cadena buscada (insensible a mayúsculas)

      if (productos.length === 0) {
          return res.status(404).json({ msg: 'No se encontraron productos' });
      }

      res.status(200).json({
          message: 'Productos encontrados',
          data: productos
      });
  } catch (error) {
      console.error("Error al buscar productos:", error);
      res.status(500).json({ message: error.message });
  }
}

export {  crearProducto, obtenerProductos, obtenerProductoPorID, modificarProductoPorID, modificarAtributoProductoPorID ,eliminarProductoPorID, buscarProductos};