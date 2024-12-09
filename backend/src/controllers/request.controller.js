import Request from "../models/request.model.js";
import Documento from "../models/document.model.js";
import User from "../models/user.model.js";

// Función para crear un préstamo
export const crearPrestamo = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { identificador, fechaVencimiento } = req.body;

    const documento = await Documento.findOne({ identificador });
    if (!documento) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    const nuevoPrestamo = new Request({
      usuarioId,
      documentoId: documento._id, // relacionar el 'identificador' con el id real
      fechaVencimiento,
    });

    await nuevoPrestamo.save();
    res.status(201).json(nuevoPrestamo);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el préstamo", error });
  }
};

//Función para obtener el prestamo de un usuario normal
export const obtenerPrestamosUsuario = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const prestamos = await Request.find({ usuarioId })
      .populate("documentoId", "titulo identificador tipo")
      .select("documentoId fechaSolicitud fechaVencimiento estado");

    if (prestamos.length === 0) {
      return res.status(404).json({ message: "No tienes préstamos registrados." });
    }

    res.status(200).json(prestamos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los préstamos", error });
  }
};

//Función para obtener los préstamos registrados en el sistema. Sólo para administradores
export const obtenerPrestamos = async (req, res) => {
  try {
    const prestamos = await Request.find()
      .populate("usuarioId", "nombres apellidos email") // obtener datos del usuario
      .populate("documentoId", "identificador titulo tipo"); // obtener datos del documento

    res.status(200).json(prestamos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los préstamos", error });
  }
};

//Función para actualizar el estado de un préstamo por identificador
export const actualizarEstadoPrestamo = async (req, res) => {
  try {
    const { identificador } = req.params; // sacar el identificador desde los parámetros de la ruta
    const { estado } = req.body;

    const documento = await Documento.findOne({ identificador });
    if (!documento) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    const prestamo = await Request.findOneAndUpdate(
      { documentoId: documento._id }, // condición: préstamo con ese documento
      { estado },
      { new: true }
    );

    if (!prestamo) {
      return res.status(404).json({ message: "Préstamo no encontrado para este documento" });
    }
    res.status(200).json(prestamo);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el préstamo", error });
  }
};