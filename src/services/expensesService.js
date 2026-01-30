import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

//Añadir una gasto al proyecto
export const addExpense = async (projectId, expense) => {
  try {
    const expensesCollection = collection(
      db,
      "projects",
      projectId,
      "expenses",
    );
    const docRef = await addDoc(expensesCollection, {
      ...expense,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...expense };
  } catch (error) {
    console.error("Error al añadir gasto: ", error);
    throw error;
  }
};

//Obtener los gastos del proyecto
export const getProjectExpenses = async (projectId) => {
  try {
    const expensesCollection = collection(
      db,
      "projects",
      projectId,
      "expenses",
    );
    const querySnapshot = await getDocs(expensesCollection);
    const expenses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return expenses;
  } catch (error) {
    console.error("Error al obtener gastos: ", error);
    throw error;
  }
};

//Actualizar un gasto del proyecto
export const updateExpense = async (projectId, expenseId, updatedExpense) => {
  try {
    const expenseRef = doc(db, "projects", projectId, "expenses", expenseId);
    await updateDoc(expenseRef, updatedExpense);
  } catch (error) {
    console.error("Error al actualizar gasto: ", error);
    throw error;
  }
};

//Eliminar un gasto del proyecto
export const deleteExpense = async (projectId, expenseId) => {
  try {
    const expenseRef = doc(db, "projects", projectId, "expenses", expenseId);
    await deleteDoc(expenseRef);
  } catch (error) {
    console.error("Error al eliminar gasto: ", error);
    throw error;
  }
};
