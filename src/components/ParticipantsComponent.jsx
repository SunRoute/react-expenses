import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { addParticipant, removeParticipant } from "../services/projectService";
import toast from "react-hot-toast";

//Componente para mostrar y gestionar los participantes del proyecto
const ParticipantsComponent = ({
  projectId,
  participants,
  isCreator = true,
}) => {
  const [newParticipantEmail, setNewParticipantEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  //Añadir un participante al proyecto
  const handleAddParticipant = async (e) => {
    e.preventDefault();
    //Validar que el email no esté vacío
    if (!newParticipantEmail.trim()) {
      toast.error("El email del participante no puede estar vacío");
      return;
    }
    //Validar que sea un email válido
    if (!isValidEmail(newParticipantEmail)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }
    //Verificar si el participante ya existe
    const participantExists = participants.some(
      (p) => p.email?.toLowerCase() === newParticipantEmail.toLowerCase(),
    );
    if (participantExists) {
      toast.error("Este participante ya existe");
      return;
    }
    //Añadir el participante al proyecto
    setLoading(true);
    try {
      await addParticipant(projectId, newParticipantEmail);
      setNewParticipantEmail("");
      toast.success("Participante añadido correctamente");
    } catch (error) {
      toast.error(error.message || "Error al añadir participante");
    } finally {
      setLoading(false);
    }
  };

  //Eliminar un participante del proyecto
  const handleRemoveParticipant = async (email) => {
    if (window.confirm(`¿Delete ${email}?`)) {
      try {
        await removeParticipant(projectId, email);
        toast.success("Participante eliminado");
      } catch (error) {
        toast.error("Error al eliminar participante");
      }
    }
  };

  return (
    <div className="p-2 md:p-3 bg-blue-800 rounded-md">
      <h3 className="text-white font-semibold mb-2 md:mb-3 text-sm md:text-base">
        Participantes
      </h3>

      {/* Lista de participantes */}
      <div className="mb-2 md:mb-3 flex flex-wrap gap-1 md:gap-2">
        {participants &&
          participants.map((p) => (
            <div
              key={p.email}
              className="flex items-center gap-1 md:gap-2 bg-blue-700 text-white px-2 md:px-3 py-1 rounded-md text-xs md:text-sm"
            >
              {/* Para que el nombre no se corte */}
              <span className="truncate">
                {p.email?.split("@")[0] ?? p.email}
              </span>
              {/* Eliminar participante (solo si es creador) */}
              {!p.isCreator && isCreator && (
                <button
                  onClick={() => handleRemoveParticipant(p.email)}
                  className="hover:text-red-500 transition shrink-0"
                  title="Eliminar"
                >
                  <MdDeleteOutline />
                </button>
              )}
            </div>
          ))}
      </div>

      {/* Añadir nuevo participante  (solo si es creador) */}
      {isCreator && (
        <form
          onSubmit={handleAddParticipant}
          className="flex gap-1 md:gap-2 flex-col sm:flex-row"
        >
          <input
            type="email"
            placeholder="email@ejemplo.com"
            value={newParticipantEmail}
            onChange={(e) => setNewParticipantEmail(e.target.value)}
            className="input input-bordered input-sm flex-1 text-xs md:text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn btn-sm btn-success text-white text-xs md:text-sm whitespace-nowrap"
          >
            {loading ? "Añadiendo..." : "Añadir"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ParticipantsComponent;
