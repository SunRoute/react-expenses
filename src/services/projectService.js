import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { getCurrentUser } from "./authService";

//Añadir un proyecto
export const addProject = async (project) => {
  try {
    const currentUser = getCurrentUser();
    const docRef = await addDoc(collection(db, "projects"), {
      ...project,
      createdBy: currentUser.uid,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...project };
  } catch (error) {
    console.error("Error al añadir proyecto: ", error);
    throw error;
  }
};

//Obtener todos los proyectos
export const getAllProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projects = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return projects;
  } catch (error) {
    console.error("Error al obtener proyectos: ", error);
    throw error;
  }
};

//Obtener un proyecto por ID
export const getProjectById = async (projectId) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const projectDoc = await getDoc(projectRef);
    if (projectDoc.exists()) {
      return { id: projectDoc.id, ...projectDoc.data() };
    } else {
      throw new Error("Proyecto no encontrado");
    }
  } catch (error) {
    console.error("Error al obtener proyecto: ", error);
    throw error;
  }
};

//Actualizar un proyecto
export const updateProject = async (projectId, updatedProject) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, updatedProject);
  } catch (error) {
    console.error("Error al actualizar proyecto: ", error);
    throw error;
  }
};

//Eliminar un proyecto
export const deleteProject = async (projectId) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error("Error al eliminar proyecto: ", error);
    throw error;
  }
};

//Añadir un participante al proyecto
export const addParticipant = async (projectId, participantEmail) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const projectDoc = await getDoc(projectRef);
    const currentParticipants = projectDoc.data().participants || [];

    //Verificar si el participante ya existe
    const participantExists = currentParticipants.some(
      (p) => p.email?.toLowerCase() === participantEmail.toLowerCase(),
    );
    if (participantExists) {
      throw new Error("El participante ya existe en el proyecto");
    }

    //Añadir el participante al proyecto si no existe
    const newParticipant = {
      name: participantEmail.split("@")[0],
      email: participantEmail.toLowerCase(),
      uid: null,
      isCreator: false,
    };
    //Actualizar el proyecto con el nuevo participante
    await updateDoc(projectRef, {
      participants: [...currentParticipants, newParticipant],
    });
  } catch (error) {
    console.error("Error al añadir participante: ", error);
    throw error;
  }
};

//Eliminar un participante del proyecto
export const removeParticipant = async (projectId, participantEmail) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    const projectDoc = await getDoc(projectRef);
    const currentParticipants = projectDoc.data().participants || [];

    const updatedParticipants = currentParticipants.filter(
      (p) => p.email?.toLowerCase() !== participantEmail.toLowerCase(),
    );
    //Actualizar el proyecto con los participantes restantes
    await updateDoc(projectRef, {
      participants: updatedParticipants,
    });
  } catch (error) {
    console.error("Error al eliminar participante: ", error);
    throw error;
  }
};
