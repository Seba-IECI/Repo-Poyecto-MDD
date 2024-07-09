import Form from '../models/inscripciones.model.js';
import Evento from '../models/evento.model.js'

export async function crearIncripcion(req, res) {
    try {
        const eventoId = req.body.eventoId;
        const user = req.user;  // Asegúrate de acceder correctamente a los datos del usuario desde la sesión
        
        // Validar si el eventoId es válido
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(400).json({ msg: 'Evento no encontrado' });
        }

        // Verificar si el emprendedor ya está inscrito en este evento
        const existingInscription = await Form.findOne({ eventoId, nombreEmprendedor: user.nombreEmprendedor});
        if (existingInscription) {
            return res.status(400).json({ message: "Ya estás inscrito en este evento." });
        }

        // Crear nueva inscripción con los datos del evento
        const newForm = new Form({
            nombreEvento: evento.nombreEvento,
            nombreEmprendimiento: user.nombreEmprendimiento,
            nombreEmprendedor: user.nombreEmprendedor,
            email: user.correo,
            numeroContacto: user.numeroContacto,
            eventoId
        });
        await newForm.save();

        // Añadir la inscripción a la lista de asistentes del evento
        await Evento.findByIdAndUpdate(eventoId, {
            $push: { inscripcionEmprendedor: { emprendedor: newForm._id }}
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
        const evento = await Evento.findById(eventoId).populate('inscripcionEmprendedor.emprendedor');
        if (!evento) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        res.status(200).json({
            message: "Asistentes obtenidos correctamente",
            data: evento.inscripcionEmprendedor
        });
    } catch (error) {
        console.error("Error al obtener asistentes:", error);
        res.status(500).json({ message: error.message });
    }
}

export async function visualizarInscripciones(req, res) {
    try {
        const user = req.session.emprendedor;  // Asegúrate de acceder correctamente a los datos del usuario desde la sesión

        if (!user) {
            return res.status(401).json({ message: "No estás autenticado" });
        }

        // Busca todas las inscripciones del emprendedor logueado
        const forms = await Form.find({ nombreEmprendedor: user.nombreEmprendedor });

        if(forms.length === 0){
            return res.status(404).json({ message: "No tienes inscripciones a eventos. Inscribete ahora!!"});
        }

        res.status(200).json({
            message: "Inscripciones encontradas exitosamente",
            data: forms
        });
    } catch (error) {
        console.error("Error al obtener inscripciones:", error);
        res.status(500).json({ message: error.message });
    }
}

export async function eliminarInscripcion(req, res){
    try {
        const id = req.params.id;
        const user = req.session.emprendedor;  // Asegúrate de acceder correctamente a los datos del usuario desde la sesión

        if (!user) {
            return res.status(401).json({ message: "No estás autenticado" });
        }

        // Primero, encuentra la inscripción para obtener el eventoId
        const form = await Form.findById(id);
        if (!form) {
            return res.status(404).json({
                message: "Inscripción no válida / no encontrada",
                data: null
            });
        }

        // Verifica si la inscripción pertenece al emprendedor logueado
        if (form.nombreEmprendedor !== user.nombreEmprendedor) {
            return res.status(403).json({
                message: "No tienes permisos para eliminar esta inscripción",
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
            $pull: { inscripcionEmprendedor: { emprendedor: id }}
        });

        res.status(200).json({
            message: "Inscripcion eliminada exitosamente",
            data: formDeleted
        })

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}