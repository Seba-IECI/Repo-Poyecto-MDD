import Asistente from '../models/asistente.model.js';

export async function registrarAsistencia(request, response) {
    try {
        const { eventoID, email, numeroContacto } = req.body;

        // Verificar que el evento exista
        const evento = await Evento.findById(eventoID);
        if (!evento) {
            return response.status(404).json({ message: 'Evento no encontrado' });
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

        response.status(201).json({
            message: 'Asistente registrado correctamente',
            data: nuevoAsistente
        });
    } catch (error) {
        console.log('Error en asistente.controller.js -> asistir(): ', error);
        response.status(500).json({ message: 'Error interno del servidor' });
    }
}