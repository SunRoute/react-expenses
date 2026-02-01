import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { updateProject, deleteProject } from "../services/projectService";
import toast from "react-hot-toast";
import ParticipantsComponent from "./ParticipantsComponent";
import { getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router";
import AddProjectComponent from "./AddProjectComponent";

//Componente para mostrar y gestionar un proyecto
const ProjectComponent = () => {
  const [projects, setProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  //Actualizar el proyecto cuando se actualicen los datos
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "projects"),
      (snapshot) => {
        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProject(projectsData);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error("Error al cargar proyectos");
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  //Editar el proyecto
  const handleEdit = (project) => {
    setSelectedProject(project);
    setUpdatedTitle(project.title);
    document.getElementById("update-modal").showModal();
  };

  //Actualizar el proyecto
  const handleUpdateProject = async () => {
    if (!selectedProject) return;
    try {
      await updateProject(selectedProject.id, {
        title: updatedTitle,
      });
      toast.success("Proyecto actualizado exitosamente");
      document.getElementById("update-modal").close();
    } catch (error) {
      toast.error("Error al actualizar el proyecto");
    }
  };

  //Eliminar el proyecto
  const handleDelete = async (projectId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      try {
        await deleteProject(projectId);
        toast.success("Proyecto eliminado exitosamente");
      } catch (error) {
        toast.error("Error al eliminar el proyecto");
      }
    }
  };
  //Ver los gastos del proyecto
  const handleViewExpenses = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  // Filtrar proyectos donde el usuario es creador o es participante (comparar por email)
  const userProjects = projects.filter((p) => {
    const isCreator = p.createdBy === currentUser?.uid;
    const isParticipant = p.participants?.some(
      (participant) =>
        participant.email?.toLowerCase() === currentUser?.email?.toLowerCase(),
    );
    return isCreator || isParticipant;
  });

  // Verificar si el usuario es el creador del proyecto
  const isProjectCreator = (project) => {
    return project.createdBy === currentUser?.uid;
  };

  return (
    <div className="p-0 md:p-4">
      {/* Componente importado para agregar un nuevo proyecto */}
      <div className="mb-3 md:mb-4">
        <AddProjectComponent />
      </div>

      {loading && (
        <p className="text-slate-600 text-sm md:text-base">
          Cargando proyectos...
        </p>
      )}
      {!loading && projects.length === 0 && (
        <p className="text-slate-500 text-sm md:text-base">
          No hay proyectos disponibles
        </p>
      )}

      <div className="space-y-3 md:space-y-4">
        {!loading &&
          userProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-2 md:gap-3 p-3 md:p-4 text-white bg-blue-950 rounded-md shadow-md"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <h1 className="text-lg md:text-2xl font-semibold wrap-break-word">
                  {project.title}
                </h1>
                {isProjectCreator(project) && (
                  <span className="p-2 rounded-md bg-blue-950 text-stone-200 border-2 border-yellow-500 text-xs md:text-sm whitespace-nowrap">
                    Creador
                  </span>
                )}
              </div>
              {/*Componente importado para mostrar y gestionar los participantes del proyecto*/}
              <ParticipantsComponent
                projectId={project.id}
                participants={project.participants || []}
                isCreator={isProjectCreator(project)}
              />
              {/* Botones para ver los gastos y acciones sobre el proyecto */}
              <div className="flex flex-col sm:flex-row w-full justify-end items-stretch sm:items-center gap-2 mt-3 md:mt-4">
                <button
                  className="btn btn-info btn-sm md:btn-md text-white flex gap-1 md:gap-2 px-2 md:px-4 text-xs md:text-sm order-1 sm:order-0"
                  onClick={() => handleViewExpenses(project.id)}
                >
                  <AiOutlineEye className="text-base md:text-lg" />
                  <span className="hidden xs:inline">Ver Gastos</span>
                </button>
                {isProjectCreator(project) && (
                  <>
                    <button
                      className="btn btn-primary btn-sm md:btn-md text-white flex gap-1 md:gap-2 px-2 md:px-4 text-xs md:text-sm"
                      onClick={() => handleEdit(project)}
                    >
                      <FaRegEdit className="text-base md:text-lg" />
                      <span className="hidden xs:inline">Editar</span>
                    </button>
                    <button
                      className="btn btn-error btn-sm md:btn-md bg-red-600 text-white flex gap-1 md:gap-2 px-2 md:px-3 text-xs md:text-sm hover:bg-red-700 transition ease-in-out"
                      onClick={() => handleDelete(project.id)}
                    >
                      <MdDeleteOutline className="text-base md:text-lg" />
                      <span className="hidden xs:inline">Eliminar</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Modal Popup para Actualizar el proyecto (DaisyUI component) */}
      <dialog id="update-modal" className="modal">
        <div className="modal-box w-11/12 max-w-md">
          <h3 className="font-bold text-lg">Actualizar Proyecto</h3>
          <div className="py-4">
            <label className="block text-slate-700 font-medium mb-2">
              Título
            </label>
            <input
              type="text"
              className="input input-bordered w-full text-sm md:text-base"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <button
              className="btn btn-primary btn-sm md:btn-md text-white"
              onClick={handleUpdateProject}
            >
              Guardar Cambios
            </button>
            <button
              className="btn btn-sm md:btn-md"
              onClick={() => document.getElementById("update-modal").close()}
            >
              Cancelar
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProjectComponent;
