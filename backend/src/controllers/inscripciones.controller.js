import Form from '../models/inscripciones.model.js';

export async function crearIncripcion(req, res){
    try {
        const formData = req.body;
        const newForm = new Form(formData);
        await newForm.save();

        res.status(201).json({
            message: "Inscripcion ingresada correctamente!",
            data: newForm
        })
    } catch (error) {
        res.status(500).json({message: error.message});
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

export async function actualizarInscripcion(req, res){
    try {
        const id = req.params.id;
        const formData = req.body;

        const formUpdated = await Form.findByIdAndUpdate(id, formData, {new: true});

        if(!formUpdated) {
            return res.status(404).json({
                message: "Inscripcion no valida / no encontrada",
                data: null
            });
        }

        res.status(200).json({
            message: "Inscripcion actualizada exitosamente",
            data: formUpdated
        })

    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

export async function eliminarInscripcion(req, res){
    try {
        const id = req.params.id;
        const formDeleted = await Form.findByIdAndDelete(id);

        if(!formDeleted) {
            return res.status(404).json({
                message: "Inscripcion no valida / no encontrada",
                data: null
            });
        }

        res.status(200).json({
            message: "Inscripcion eliminada exitosamente",
            data: formDeleted
        })

    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
}

