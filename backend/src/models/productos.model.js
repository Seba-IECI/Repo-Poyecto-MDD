"use strict";

import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
  {
    eventoId:{
      type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId para referenciar el evento
      ref: 'Evento',
      required: true
    },
    emprendedorId:{
      type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId para referenciar el evento
      ref: 'Emprendedor',
      required: true
    },
    nombre: { 
      type: String, 
      required: true,
      unique: true
    },
    descripcion: { 
      type: String, 
      required: true 
    },
    precio: { 
      type: Number, 
      required: true 
    },
    stock: { 
      type: Number, 
      required: true 
    }, 
  }
);

const Product = mongoose.model('Product', productoSchema);

export default Product;