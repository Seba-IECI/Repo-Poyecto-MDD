// controllers/asistente.controller.js
import Asistente from '../models/asistente.model.js';
import Evento from '../models/evento.model.js';

export async function registrarAsistencia(req, res) {
    try {
        const { eventoID, email, numeroContacto } = req.body;

        // Verificar que el evento exista
        const evento = await Evento.findById(eventoID);
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        // Obtener la fecha actual
        const fechaActual = new Date();

        // Verificar si la fecha actual está dentro del rango de fecha limite del evento
        if (fechaActual > evento.fechaLimiteInscripcion) {
            return res.status(400).json({ message: 'No se puede registrar fuera del rango de fechas del evento.' });
        }

        // Crear un nuevo asistente
        const nuevoAsistente = new Asistente({
            eventoID,
            email,
            numeroContacto
        });

        // Guardar el asistente en la base de datos
        await nuevoAsistente.save();

        // Agregar el asistente al evento
        evento.asistentes.push(nuevoAsistente._id);
        await evento.save();

        res.status(201).json({
            message: 'Asistente registrado correctamente',
            data: nuevoAsistente
        });
    } catch (error) {
        console.log('Error en asistente.controller.js -> registrarAsistencia(): ', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export async function eliminarAsistencia(req, res) {
    try {
        const idAsistente = req.query.Asistente;

        if (!idAsistente) {
            return res.status(400).json({
                message: 'Debe ingresar un id para continuar.',
                data: null
            });
        }

        const asistente = await Asistente.findOneAndDelete({ _id: idAsistente });

        if (!asistente) {
            return res.status(404).json({
                message: 'No se ha encontrado la ID.',
                data: null
            });
        }

        // También eliminar la referencia del asistente en el evento
        await Evento.updateOne(
            { asistentes: idAsistente },
            { $pull: { asistentes: idAsistente } }
        );

        res.status(200).json({
            message: 'Asistente eliminado exitosamente.',
            data: asistente
        });

    } catch (error) {
        console.log('Error en asistente.controller.js -> eliminarAsistencia(): ', error);
        res.status(500).json({ message: error.message });
    }
}
