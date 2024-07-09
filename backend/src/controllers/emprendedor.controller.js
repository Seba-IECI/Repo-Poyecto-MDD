'use strict';

import { response } from 'express';
import Role from '../models/role.model.js';
import Emprendedor  from '../models/emprendedor.model.js';

export async function crearEmprendedor(request, response){
    try {
        const infoEmprendedor = request.body; //se obtiene los datos de emprendedor
        //Verficamos si ya existe con una const auxiliar
        const encontrarEmprendedor = await Emprendedor.findOne({correo: infoEmprendedor.correo});
        if(encontrarEmprendedor){ //si existe significa que se encontro un correo igual en la BD
            return response.status(400).json({
                mesagge: "Correo Electrónico ya registrado",
            })
        } 

        const emprendedorRol = await Role.findOne({ name: 'emprendedor' }); //verificamos que exista el rol de emprendedor
        if (!emprendedorRol) {
            return response.status(500).json({ message: "No existe el rol de emprendedor." });
        }

        const nuevoEmprendedor = new Emprendedor(infoEmprendedor); //creo un objeto de la clase Emprendedor
        nuevoEmprendedor.password = await Emprendedor.encryptPassword(infoEmprendedor.password); //encriptamos contraseña 
        nuevoEmprendedor.roles = [emprendedorRol._id] //le pasemos el id del rol
        await nuevoEmprendedor.save(); //se guarda en la BD 

        response.status(201).json({
            message: "Registro con exito!",
            data: nuevoEmprendedor
        });

    } catch (error) {
        console.log("Error en emprendedor.controller.js -> crearEmprendedor(): ", error);
        response.status(500).json({ message: "Error del servidor" });
    }
}

export async function emprendedorLogin(request, response){
    try {
        const emprendedor = request.body; //Pasamos los datos del body 
        const emprendedorEncontrado = await Emprendedor.findOne({ correo: emprendedor.correo })
            .populate("roles") //se le asigna el rol de emprendedor
            .exec();

        if (emprendedorEncontrado === null) {
            return response.status(400).json({
                message: "Correo Electrónico es incorrecto"
            });
        }

        const verificarPassword = await Emprendedor.comparePassword(
            emprendedor.password,
            emprendedorEncontrado.password
        );

        if (!verificarPassword) {
            return response.status(400).json({
                message: "La contraseña es incorrecta"
            });
        }

        request.session.emprendedor = {
            nombreEmprendedor: emprendedorEncontrado.nombreEmprendedor,
            rutEmprendedor: emprendedorEncontrado.rutEmprendedor,
            nombreEmprendimiento: emprendedorEncontrado.nombreEmprendimiento,
            numeroContacto: emprendedorEncontrado.numeroContacto,
            correo: emprendedorEncontrado.correo,
            rolName: emprendedorEncontrado.roles[0].name
        };

        response.status(200).json({
            message: "Inicio de sesión completo",
            data: request.session.emprendedor
        });

    } catch (error) {
        console.log("Error en emprendedor.controller.js -> emprendedorLogin(): ", error);
        response.status(500).json({ message: "Error del servidor" });
    }
}


export async function perfil(request, response) { //ver sesion iniciada
    try{

        const datos = request.session.emprendedor;
    
        if(!datos) {
            return response.status(400).json({
                message: "Se debe iniciar sesión!"
            })
        }
        response.status(200).json(datos);
    } catch (error) {
        console.log("Error en emprendedor.controller.js -> perfil():", error);
        response.status(500).json({ message: "Error del servidor" });
    }
}


export async function modificarEmprendedor(request, response){
    try {
        const rutEmprendedor = request.query.rutEmprendedor; //obtenemos el rut del emprendedor
        const datosNuevos = request.body; //obtenemos datos a actualizar

        if (!rutEmprendedor) {//verificamos si existe el emprendedor a modificar
            response.status(400).json({
                message: "El parámetro 'rut Emprendedor' es requerido.",
            });
        return;
        } 


        if(datosNuevos.password){
            datosNuevos.password = await Emprendedor.encryptPassword(datosNuevos.password); //encriptamos la nuevaPassword
        }
        //buscamos al emprendedor y lo modificamos

        const emprendedorMod = await Emprendedor.findOneAndUpdate({rutEmprendedor: rutEmprendedor}, datosNuevos, {new: true});
        
        if(!emprendedorMod){
            response.status(404).json({
                mesagge: "Emprendedor a modificar no existe",
                data: null
            });
            return;
        }
        response.status(200).json({
            message: "Emprendedor actualizado:",
            data: emprendedorMod
        });
    }catch (error) {
        console.log("Error en emprendedor.controller.js -> modificarEmprendedor(): ", error);
        response.status(500).json({ mesagge: error.mesagge});
    }   
}

export async function obtenerEmprendedor(request, response){
    try {
        const rutEmprendedor = request.query.rutEmprendedor; //obtenemos el rut del emprendedor
        if (!rutEmprendedor) { //si es nulo el rut de emprendedor
            response.status(400).json({
                message: "El parámetro 'rut Emprendedor' es requerido.",
            });
            return;
        }

        const emprendedor = await Emprendedor.findOne({rutEmprendedor: rutEmprendedor}); //Busca por el rut en los rutEmprendedor y lo guardamos
        
        if(!emprendedor){ //Si el emprendedor no existe en la base de datos
            response.status(404).json({
                mesagge: "No existe el emprendedor",
                data: null
            })
            return;
        }

        response.status(200).json({
            message: "Información del emprendedor:",
            data: emprendedor
        })
    } catch (error) { //en caso de error en la funcion 
        console.log("Error en emprendedor.controller.js -> obtenerEmprendedor(): ", error);
        response.status(500).json({ message: error.message });
    }
}

export async function obtenerEmprendedores(request, response){
    try {
        const emprendedores = await Emprendedor.find().populate('roles','name'); //find devuelve todos los json
        response.status(200).json({
            mesagge: "Lista de emprendedores",
            data: emprendedores
        });
    } catch (error) {
        console.log("Error en emprendedor.controller.js -> obtenerEmprendedores(): ", error);
        response.status(500).json({ message: error.mesagge});
    }
}

export async function eliminarEmprendedor(request, response){
    try {
        const rutEmprendedor = request.query.rutEmprendedor;//Obtenemos el rut mediante la ruta
        
        if(!rutEmprendedor){
            response.status(400).json({
                message: "Ingrese rut emprendedor.",
                data: null
            });
            return;           
        }

        const emprendedor = await Emprendedor.findOneAndDelete({rutEmprendedor: rutEmprendedor});
        
        if (!emprendedor) {
            return response.status(404).json({
                message: "Emprendedor no encontrado",
                data: null
            });
        }
        response.status(200).json({
            message: "Emprendedor eliminado:",
            data: emprendedor
        });
    } catch (error) {
        console.log("Error en emprendedor.controller.js -> eliminarEmprendedor(): ", error);
        response.status(500).json({ message: error.message });        
    }
}