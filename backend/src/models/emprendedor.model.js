"use strict";

// Se importa el módulo de 'mongoose' biblioteca para interactuar con MongoBD desde nodeJS
import mongoose from "mongoose";
// Se importa bcryptjs para utilizar su método de encriptación y
import bcrypt from "bcryptjs";

// Crear la colección de usuarios 
const emprendedorSchema = new mongoose.Schema(
    {
        rutEmprendedor: {
            type: String,
            required: true,
            unique: true, //debe ser unico el rut del emprendedor
        },
        nombreEmprendedor: {
            type: String,
            required: true,  
        },
        nombreEmprendimiento: {
            type: String,
            required: true,
            unique:true,           
        },
        numeroContacto: {
            type: Number,
            required: true,
            unique: true
        },
        correo: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        roles: [ //generamos un rol con emprendedor
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            },
        ],
    },
        {
            versionKey: false,
        }
);


// Contraseña del usuario encriptada
// Toma una contraseña y la encripta 
emprendedorSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};


  // Comparación entre contraseña encriptada y recibida
  //Compara una contraseña proporcionada con una encriptada y almacenada
emprendedorSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
};

  // Modelo de datos de usuario
const Emprendedor = mongoose.model("Emprendedor", emprendedorSchema, "Emprendedores");

export default Emprendedor; //exportamos para usar en el codigo