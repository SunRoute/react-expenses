import React, { useState } from "react";
import { addProject } from "../services/projectService";
import { getCurrentUser } from "../services/authService";
import toast from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";

//Componente para agregar un nuevo proyecto
const AddProjectComponent = () => {
  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState([]);
  const [newParticipantEmail, setNewParticipantEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const currentUser = getCurrentUser();
  //Validar que sea un email válido
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  //Añadir un participante al proyecto y verificar email (vacío e inválido)
  const handleAddParticipant = () => {
    if (!newParticipantEmail.trim()) {
      toast.error("El email del participante no puede estar vacío");
      return;
    }
    if (!isValidEmail(newParticipantEmail)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }
    //Verificar si el participante ya existe
    const participantExists = participants.some(
      (p) => p.email.toLowerCase() === newParticipantEmail.toLowerCase(),
    );
    if (participantExists) {
      toast.error("Este participante ya existe");
      return;
    }
    //Verificar si el participante es el creador del proyecto
    if (newParticipantEmail.toLowerCase() === currentUser.email.toLowerCase()) {
      toast.error("Ya eres participante del proyecto");
      return;
    }

    //Añadir el participante al proyecto
    setParticipants([
      ...participants,
      {
        name: newParticipantEmail.split("@")[0], //Usa el nombre antes del @
        email: newParticipantEmail.toLowerCase(),
        uid: null,
        isCreator: false,
      },
    ]);
    setNewParticipantEmail("");
  };

  //Eliminar un participante del proyecto
  const handleRemoveParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  //Crear un nuevo proyecto
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (submitting) return; // evitar dobles envíos
    //Validar que el título no esté vacío
    if (!title.trim()) {
      toast.error("El título del proyecto es requerido");
      return;
    }

    setSubmitting(true);
    //Recorrer todos los participantes y añadirlos al array
    try {
      const allParticipants = [
        {
          name: currentUser.displayName || currentUser.email,
          email: currentUser.email.toLowerCase(),
          uid: currentUser.uid,
          isCreator: true,
        },
        ...participants,
      ];
      //Añadir el proyecto
      await addProject({
        title: title.trim(),
        // description: "",
        participants: allParticipants,
        createdAt: new Date().toISOString(),
      });

      toast.success("Proyecto creado exitosamente");
      setTitle("");
      setParticipants([]);
      document.getElementById("add-project-modal").close();
    } catch (error) {
      toast.error("Error al crear el proyecto");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-primary text-stone-200"
        onClick={() => document.getElementById("add-project-modal").showModal()}
      >
        + Nuevo Proyecto
      </button>
      {/* Modal Popup para Crear un nuevo proyecto */}
      <dialog id="add-project-modal" className="modal">
        <div className="modal-box w-5/6 max-w-md bg-stone-200 text-blue-950">
          <h3 className="font-bold text-lg mb-4">Crear Nuevo Proyecto</h3>

          <form onSubmit={handleCreateProject} className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Título del Proyecto
              </label>
              <input
                type="text"
                placeholder="Ej: Viaje a Menorca"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            {/* Participantes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Participantes
              </label>

              {/* Participante actual */}
              <div className="mb-3 p-2 bg-yellow-500 rounded-md">
                <span className="text-sm font-semibold text-blue-950">
                  {currentUser.displayName ?? currentUser.email} (Tú)
                </span>
              </div>

              {/* Lista de participantes añadidos */}
              {participants.length > 0 && (
                <div className="mb-6 space-y-2">
                  {participants.map((p, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between  bg-stone-200 rounded-md"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{p.email}</span>
                        {/* Esto serviría para indicar que el participante ya está registrado, pero hay que ver si es posible obtenerlo de Firebase */}
                        {/* <span className="text-xs text-slate-500">
                          {p.uid ? "Registrado" : "No registrado"}
                        </span> */}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveParticipant(index)}
                        className="btn btn-ghost btn-lg text-red-600"
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Añadir nuevo participante */}
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="email@ejemplo.com"
                  value={newParticipantEmail}
                  onChange={(e) => setNewParticipantEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddParticipant();
                    }
                  }}
                  className="input input-bordered input-sm flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddParticipant}
                  className="btn btn-sm bg-lime-600 hover:bg-lime-700 text-white"
                >
                  Añadir
                </button>
              </div>
            </div>

            {/* Acciones */}
            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary text-white"
                disabled={submitting}
              >
                {submitting ? "Creando..." : "Crear Proyecto"}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() =>
                  document.getElementById("add-project-modal").close()
                }
                disabled={submitting}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default AddProjectComponent;
