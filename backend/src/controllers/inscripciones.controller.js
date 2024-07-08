import Form from '../models/inscripciones.model.js';
import Evento from '../models/evento.model.js'

export async function crearIncripcion(req, res) {
    try {
        const { nombreEmprendimiento, numeroContacto, eventoId } = req.body;
        const user = req.session.user;  // Asegúrate de acceder correctamente a los datos del usuario desde la sesión

        // Validar si el eventoId es válido
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(400).json({ msg: 'Evento no encontrado' });
        }

        // Verificar si el emprendedor ya está inscrito en este evento
        const existingInscription = await Form.findOne({ eventoId, nombreEmprendedor: user.username });
        if (existingInscription) {
            return res.status(400).json({ message: "Ya estás inscrito en este evento." });
        }

        // Crear nueva inscripción con los datos del evento
        const newForm = new Form({
            nombreEvento: evento.nombreEvento,
            nombreEmprendimiento,
            nombreEmprendedor: user.username,
            email: user.email,
            numeroContacto,
            eventoId
        });

        await newForm.save();

        // Añadir la inscripción a la lista de asistentes del evento
        await Evento.findByIdAndUpdate(eventoId, {
            $push: { asistentes: newForm._id }
        });

        res.status(201).json({
            message: `Inscripción ingresada correctamente al evento: ${evento.nombreEvento}`, // Muestra el mensaje con el nombre del evento
            data: newForm
        });
    } catch (error) {
        console.error("Error al crear inscripción:", error);
        if (error.code === 11000) {
            res.status(400).json({
                message: "Ya estás inscrito en este evento."
            });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
}

export async function obtenerAsistentes(req, res) {
    try {
        const eventoId  = req.params.eventoId;

        // Encuentra el evento y rellena el campo asistentes
        const evento = await Evento.findById(eventoId).populate('asistentes');
        if (!evento) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        res.status(200).json({
            message: "Asistentes obtenidos correctamente",
            data: evento.asistentes
        });
    } catch (error) {
        console.error("Error al obtener asistentes:", error);
        res.status(500).json({ message: error.message });
    }
}

export async function obtenerInscripcion(req, res){
    try {
        const id = req.params.id;

        const form = await Form.findById(id);

        if(!form) {
            return res.status(404).json({
                message: "Inscripcion no valida / no encontrada",
                data: null
            });
        }

        res.status(200).json({
            message: "Inscripcion encontrada exitosamente",
            data: form
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

export async function eliminarInscripcion(req, res){
    try {
        const id = req.params.id;

        // Primero, encuentra la inscripción para obtener el eventoId
        const form = await Form.findById(id);
        if (!form) {
            return res.status(404).json({
                message: "Inscripción no válida / no encontrada",
                data: null
            });
        }

        // Elimina la inscripción
        const formDeleted = await Form.findByIdAndDelete(id);
        if(!formDeleted) {
            return res.status(404).json({
                message: "Inscripcion no valida / no encontrada",
                data: null
            });
        }

        // Actualiza el evento eliminando la inscripción de la lista de asistentes
        await Evento.findByIdAndUpdate(form.eventoId, {
            $pull: { asistentes: id }
        });

        res.status(200).json({
            message: "Inscripcion eliminada exitosamente",
            data: formDeleted
        })

    } catch (error) {
        res.status(500).json({message: error.message});
    }

}

