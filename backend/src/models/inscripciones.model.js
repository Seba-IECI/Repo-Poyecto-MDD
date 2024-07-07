import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    nombreEmprendimiento: {
        type: String,
        required: true
    },
    nombreEmprendedor: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    numeroContacto: {
        type: String,
        required: true,
        unique: true
    }
},
{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    },
})

export default mongoose.model('Form', formSchema, 'Inscripciones');

/*El sistema debe permitir a los emprendedores inscribirse a un evento para participar como emprendedor (CreateForm), 
además de visualizar(getForm), modificar (UpdateFormy cancelar su inscripción (DeleteForm) a los eventos en las fechas correspondientes y verificar que no tenga 2 warning 
*/