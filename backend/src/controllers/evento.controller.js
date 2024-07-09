'use strict';

import Evento from '../models/evento.model.js';
import Form from '../models/inscripciones.model.js';
import Emprendedor  from '../models/emprendedor.model.js';


export async function crearEvento(req, res){
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
}

export async function obtenerEventos(req, res){
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
}
export async function actualizarEvento(req,res) {
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
}

export async function eliminarEvento(req, res){
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
        await Evento.findByIdAndDelete(eventoID);

        res.status(200).json({
            message: "Evento eliminado correctamente",
            data: null
        });
    } catch (error) {
        console.log("Error en evento.controller.js -> eliminarEvento(): ", error);
        res.status(500).json({ message: error.message });
    }
}

export async function buscarEvento(req, res) {
    try {
        const nombreEvento = req.params.nombreEvento;

        if (!nombreEvento) {
            return res.status(400).json({
                message: "Debe ingresar el nombre del evento.",
                data: null
            });
        }

        // Buscar eventos que contengan el nombre especificado usando una coincidencia parcial
        const eventos = await Evento.find({ nombreEvento: { $regex: nombreEvento, $options: 'i' } }); 
        // $regex: Permite realizar busquedas parciales de una palabra // $options: Permite que no haya distincion entre mayusculas y minusculas
        if (eventos.length === 0) {
            return res.status(404).json({
                message: "No se han encontrado resultados de su búsqueda.",
                data: null
            });
        }

        res.status(200).json({
            message: "Eventos encontrados:",
            data: eventos
        });
    } catch (error) {
        console.log("Error en evento.controller.js -> buscarEvento(): ", error);
        res.status(500).json({ message: error.message });
    }
}

export async function confirmarAsistencia(req, res) {
    try {
        const datos = req.body; // O puedes usar req.query si los datos vienen en la query string

        if (!datos.eventoID || !datos.nombreEmprendedor) {
            return res.status(400).json({ message: "Faltan datos necesarios" });
        }
        const evento = await Evento.findById(datos.eventoID);
        const nombreEvento = evento.nombreEvento;
        const nombreEmprendedor = datos.nombreEmprendedor;
        const emprendedorInscripcion = await Form.findOne({ //obtenemos la inscripcion de un emprendedor en cierto evento
            nombreEvento: nombreEvento,
            nombreEmprendedor: nombreEmprendedor });
        console.log(emprendedorInscripcion);
        
        const eventoID = datos.eventoID
        console.log(eventoID);
        await Evento.findByIdAndUpdate(eventoID, 
            {$set: { 'inscripcionEmprendedor.$[elem].confirmado': true }},
            {arrayFilters: [{ 'elem.emprendedor': emprendedorInscripcion._id }]}
        );
        
        if (!emprendedorInscripcion) {
            return res.status(404).json({ message: "No se encontró el emprendedor especificado" });
        }

        res.status(200).json({
            message: "Asistencia registrada",
        });
    } catch (error) {
        console.error("Error al confirmar asistencia:", error);
        res.status(500).json({ message: error.message });
    }
}