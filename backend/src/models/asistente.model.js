import mongoose from "mongoose";

const asistenteSchema = new mongoose.Schema({
    eventoID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    numeroContacto: {
        type: Number,
        required: true
    }
}, { versionKey: false });

export default mongoose.model('Asistente', asistenteSchema);