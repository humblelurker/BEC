import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contraseña: {
        type: String,
        required: true,
    },
    foto: {
        type: String, // url de la imagen
        required: true
    },
}, {
    timestamps: true
})
export default mongoose.model('User', userSchema)