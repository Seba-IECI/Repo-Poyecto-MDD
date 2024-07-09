import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    nombreEvento: {
        type: String,
        required: true
    },
    eventoId: {
        type: mongoose.Schema.Types.ObjectId, // Tipo ObjectId para referenciar el evento
        ref: 'Evento',
        required: true
    },
    nombreEmprendimiento: {
        type: String,
        required: true
    },
    nombreEmprendedor: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    numeroContacto: {
        type: Number,
        required: true,
    },
},
{
    versionKey: false,
})

// Añadir un índice compuesto para nombreEmprendedor y eventoId
formSchema.index({ nombreEmprendedor: 1,eventoId: 1 }, { unique: true });

export default mongoose.model('Form', formSchema, 'Inscripciones');

/*El sistema debe permitir a los emprendedores inscribirse a un evento para participar como emprendedor (CreateForm), 
además de visualizar(getForm), modificar (UpdateFormy cancelar su inscripción (DeleteForm) a los eventos en las fechas correspondientes y verificar que no tenga 2 warning 
*/