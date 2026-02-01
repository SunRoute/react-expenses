import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getProjectById } from "../services/projectService";
import {
  addExpense,
  getProjectExpenses,
  updateExpense,
  deleteExpense,
} from "../services/expensesService";
import { getCurrentUser } from "../services/authService";
import toast from "react-hot-toast";
import { MdDeleteOutline, MdArrowBack } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

//Componente para mostrar y gestionar un proyecto
const ExpensesComponent = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const currentUser = getCurrentUser();

  // Estados de la aplicación
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitAmong, setSplitAmong] = useState([]);

  //Carga de datos del proyecto
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const projectData = await getProjectById(projectId);
        setProject(projectData);
        setPaidBy(currentUser.displayName || currentUser.email);
        setSplitAmong(projectData.participants.map((p) => p.name));

        const expensesData = await getProjectExpenses(projectId);
        setExpenses(expensesData);
      } catch (error) {
        toast.error("Error al cargar el proyecto");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [projectId, navigate, currentUser]);

  //Añadir un gasto al proyecto
  const handleAddExpense = async (e) => {
    e.preventDefault();
    //Validar que el concepto no esté vacío y que la cantidad no sea negativa
    if (!concept.trim() || !amount || parseFloat(amount) <= 0) {
      toast.error("Por favor completa todos los campos correctamente");
      return;
    }
    //Validar que haya al menos un participante en la división
    if (splitAmong.length === 0) {
      toast.error("Debe haber al menos un participante en la división");
      return;
    }
    //Añadir el gasto al proyecto
    try {
      const newExpense = {
        concept: concept.trim(),
        amount: parseFloat(amount),
        paidBy,
        splitAmong,
        amountPerPerson: parseFloat(amount) / splitAmong.length,
      };
      //Actualizar o añadir el gasto al proyecto
      if (editingExpense) {
        await updateExpense(projectId, editingExpense.id, newExpense);
        toast.success("Gasto actualizado");
        setEditingExpense(null);
      } else {
        await addExpense(projectId, newExpense);
        toast.success("Gasto añadido");
      }

      // Recargar gastos
      const expensesData = await getProjectExpenses(projectId);
      setExpenses(expensesData);

      // Resetear formulario
      setConcept("");
      setAmount("");
      setPaidBy(currentUser.displayName || currentUser.email);
      setSplitAmong(project.participants.map((p) => p.name));
      setShowForm(false);
    } catch (error) {
      toast.error("Error al guardar el gasto");
      console.error(error);
    }
  };

  //Editar un gasto del proyecto
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setConcept(expense.concept);
    setAmount(expense.amount.toString());
    setPaidBy(expense.paidBy);
    setSplitAmong(expense.splitAmong);
    setShowForm(true);
  };

  //Eliminar un gasto del proyecto
  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm("¿Eliminar este gasto?")) {
      try {
        await deleteExpense(projectId, expenseId);
        toast.success("Gasto eliminado");
        const expensesData = await getProjectExpenses(projectId);
        setExpenses(expensesData);
      } catch (error) {
        toast.error("Error al eliminar el gasto");
      }
    }
  };

  //Cambiar el estado de un participante en la división
  const toggleParticipant = (participantName) => {
    if (splitAmong.includes(participantName)) {
      setSplitAmong(splitAmong.filter((p) => p !== participantName));
    } else {
      setSplitAmong([...splitAmong, participantName]);
    }
  };

  //Cancelar la edición del gasto
  const handleCancelEdit = () => {
    setEditingExpense(null);
    setConcept("");
    setAmount("");
    setPaidBy(currentUser.displayName || currentUser.email);
    setSplitAmong(project.participants.map((p) => p.name));
    setShowForm(false);
  };
  //Verificar si el usuario es el creador del proyecto
  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }
  //Verificar si el proyecto existe
  if (!project) {
    return <div className="p-4">Proyecto no encontrado</div>;
  }

  // Calcular el total de gastos
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return (
    <>
      <div className="min-h-screen bg-blue-950 rounded-md">
        <div className="p-4 max-w-6xl mx-auto min-h-130">
          {/* Título y botón de regresar */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/")}
              className="btn btn-ghost btn-circle text-stone-200 hover:text-blue-950"
            >
              <MdArrowBack className="text-xl" />
            </button>
            <h1 className="text:lg md:text-3xl font-bold">{project.title}</h1>
          </div>

          <div className="mb-6 p-4 bg-slate-500 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              {/* Suma de gastos */}
              <span className="p-2 rounded-md bg-stone-200 text-blue-950 border-2 border-blue-950 text:lg md:text-3xl font-bold whitespace-nowrap">
                Total gastos: {totalExpenses.toFixed(2)}€
              </span>
              {/* Botón para añadir gasto */}
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary text-white"
                >
                  + Añadir Gasto
                </button>
              )}
            </div>

            {/* Lista de participantes */}
            <h2 className="text-lg text-stone-200 font-semibold mb-2">
              Participantes
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.participants.map((p) => (
                <span
                  key={p.name}
                  className="bg-blue-950 text-stone-200 px-3 py-2 rounded-md text-xs md:text-sm"
                >
                  {p.name || p.email}
                </span>
              ))}
            </div>
          </div>

          {/* Formulario de gastos */}
          {showForm && (
            <div className="mb-6 p-4 bg-stone-200 text-blue-950 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">
                {editingExpense ? "Editar Gasto" : "Nuevo Gasto"}
              </h2>
              <form onSubmit={handleAddExpense} className="space-y-4">
                {/* Concepto */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Concepto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Reserva excursión"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Importe */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Importe
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>

                {/* Pagado por */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Pagado por
                  </label>
                  <select
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    {project.participants.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dividir entre */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dividir entre
                  </label>
                  <div className="space-y-2">
                    {project.participants.map((p) => (
                      <label key={p.name} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={splitAmong.includes(p.name)}
                          onChange={() => toggleParticipant(p.name)}
                          className="checkbox"
                        />
                        <span>{p.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Botones de acciones */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="btn bg-lime-600 hover:bg-lime-700 text-white flex-1"
                  >
                    {editingExpense ? "Actualizar" : "Añadir"} Gasto
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de gastos */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Gastos</h2>
            {expenses.length === 0 ? (
              <p className="text-gray-500">No hay gastos registrados</p>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="p-4 bg-white border rounded-lg shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {expense.concept}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Pagado por: {expense.paidBy}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-blue-950">
                        €{expense.amount.toFixed(2)}
                      </span>
                    </div>

                    <div className="mb-3 text-sm text-gray-600">
                      <p>
                        Dividido entre ({expense.splitAmong.length} personas):
                      </p>
                      <p className="ml-2">{expense.splitAmong.join(", ")}</p>
                      <p className="ml-2 font-semibold">
                        {expense.amountPerPerson.toFixed(2)}€ por persona
                      </p>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="btn btn-sm btn-primary text-white"
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="btn btn-sm btn-error bg-red-500 text-white"
                      >
                        <MdDeleteOutline />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpensesComponent;
