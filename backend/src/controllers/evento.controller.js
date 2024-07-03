'use strict';

import Evento from '../models/evento.model.js';
import { isAdmin } from '../middlewares/auth.middleware.js'

export async function crearEvento(req, res){
    isAdmin(req, res, async () => {
    try {

        const datosEvento = req.body; // Se crea una constante con los datos del evento (nombreEvento, fecha, hora, etc).

        // Se crea la constante para ver si existe un evento en la BD que tenga el mismo nombre, para esto usamos findOne.
        const existeEvento = await Evento.findOne({ nombreEvento: datosEvento.nombreEvento }); // El await se usa porque es una operacion asincronica y espera una respuesta de la BD.
        if(existeEvento) {
            return res.status(400).json({
                message: "Ya existe un evento con el mismo nombre",
                data: null
            })
        }

        const nuevoEvento = await Evento.create(datosEvento);

        res.status(201).json({
            mesage: "Evento creado corrrectamente",
            data: nuevoEvento
        });
    } catch (error) {
        console.log("Error en evento.controller.js -> crearEvento(): ", error);
        res.status(500).json({ message: error.message });
    }
    });
}

export async function obtenerEventos(req, res){
    isAdmin(req, res, async () => {
    try {
        const eventos = await Evento.find(); // Busca todos los documentos en la coleccion de eventos.
        res.status(200).json({
            message: "Lista de Eventos",
            data: eventos
        });
    } catch (error) {
        console.log("Error en evento.controller.js -> obtenerEventos(): ", error);
        res.status(500).json({ message: error.message });
    }
    });
}
export async function actualizarEvento(req,res) {
    isAdmin(req, res, async () => {
    try {
        const eventoID = req.params.id;
        const datosEventoNuevos = req.body;

        // Verifica si el evento existe antes de intentar actualizarlo
        const existeEvento = await Evento.findById(eventoID);
        if (!existeEvento) {
            return res.status(404).json({
                message: "Evento no encontrado",
                data: null
            });
        }

        // Metodo para actualizar un evento, con el id y los datos que debe actulizar, el tercer parametro indica que se debe devolver el documento actualizado en lugar del original.
        const eventoActualizado = await Evento.findByIdAndUpdate(eventoID, datosEventoNuevos,{new: true});
        res.status(200).json({
            message: "Evento actualizado correctamente",
            data: eventoActualizado
        });
    } catch (error) {
        console.log("Error en evento.controller.js -> actualizarEvento(): ", error);
        res.status(500).json({ message: error.message });
    }
    });
}

export async function eliminarEvento(req, res){
    isAdmin(req, res, async () => {
    try {
        const eventoID = req.params.id;

          // Verifica si el evento existe antes de intentar actualizarlo
        const existeEvento = await Evento.findById(eventoID);
        if (!existeEvento) {
            return res.status(404).json({
                message: "Evento no encontrado",
                data: null
            });
        }

        // Elimina el evento
        await Evento.findByIdAndRemove(eventoID);

        res.status(200).json({
            message: "Evento eliminado correctamente",
            data: null
        });
    } catch (error) {
        console.log("Error en evento.controller.js -> eliminarEvento(): ", error);
        res.status(500).json({ message: error.message });
    }
    });
}

