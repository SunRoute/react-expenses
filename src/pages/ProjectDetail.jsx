import React from "react";
import ExpensesComponent from "../components/ExpensesComponent";
import NavbarComponent from "../components/NavbarComponent";
import FooterComponent from "../components/FooterComponent";

const ProjectDetail = () => {
  return (
    <div className="min-h-screen bg-gray-400 flex flex-col">
      {/* navbar */}
      <NavbarComponent />
      {/* Contenedor para el proyecto */}
      <div className="flex-1 w-full py-4 md:py-6 px-3 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-3 bg-blue-200 rounded-md p-3 md:p-4">
            <h1 className="text-blue-900 font-semibold text-base md:text-lg">
              Mis proyectos
            </h1>
            <ExpensesComponent />
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="mt-auto text-center py-3 md:py-4 text-gray-600 text-xs md:text-sm">
        <FooterComponent appName="Project Creator" />
      </div>
    </div>
  );
};

export default ProjectDetail;
