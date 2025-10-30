import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="p-10 flex flex-col items-center justify-center h-screen w-full">
      <h1 className="text-white text-4xl">React Dynamic Form & Data Grid</h1>

      <div className="p-10 flex gap-8">
        <button
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          onClick={() => navigate("/formbuilder")}
        >
          Form Builder
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          onClick={() => navigate("/datagrid")}
        >
          Data-Grid
        </button>
      </div>

      {/* {page === "form" ? <FormBuilderPage /> : <DataGridPage />} */}
    </div>
  );
}
