'use strict';

// Se importa el módulo de 'mongoose'. Nos permite definir esquemas con una estructura especifica.
import mongoose from "mongoose";

// Se define un nuevo esquema para los Eventos. Un esquema es una estructura de datos que representa la forma de los documentos dentro 
// de una coeccion en MongoDB
const eventoSchema = new mongoose.Schema({ 

    nombreEvento: { // Se define un nuevo campo del esquema
        type: String, // Se define el tipo de dato de este campo
        required: true, // Es requetido porque debe ser obligatorio llenar este campo
        unique: true // Debe ser unico porque no pueden haber dos eventos con el mismo nombre
        },
    descripcion: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    cantEmprendedores: {
        type: Number,
        required: true
    },
    fechaLimiteInscripcion: {
        type: Date,
        required: true
    },
    ubicacion: {
        type: String,
        required: true
    },
    asistentes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asistente'
    }],
    inscripcionEmprendedor: [{
    emprendedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form' // Referencia al modelo de Inscripción
    },
    productos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' // Referencia al modelo de Producto
    },
    confirmado: {
        type: Boolean,
        default: false
    },
    
    }]
});

// Se crea un modelo llamado 'Evento' baso en el esquema que creamos 'eventoSchema'. 
const Evento = mongoose.model('Evento', eventoSchema);

// Se exporta el modelo 'Evento' para que pueda ser utilizado en otras partes del software
export default Evento;