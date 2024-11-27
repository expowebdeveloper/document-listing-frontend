import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const DocumentForm = ({ onAdd }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const newDocument = {
      name: data.name,
      content: data.content,
      // created_at: new Date().toISOString(),
      // size: data.content.length,
    };

    try {
      const response = await fetch(`${process.env.REACT_BASE_URL}/api/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDocument),
      });

      if (!response.ok) {
        throw new Error("Failed to add document");
      }

      const result = await response.json();
      console.log("Document added:", result);

      onAdd(result); 

      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-r from-purple-600 to-blue-600">
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 border-2 border-gray-200 rounded-lg shadow-lg bg-white w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-purple-600 mb-6">Create a New Document</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Document Name</label>
          <input
            type="text"
            {...register("name", { required: "Document name is required" })}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter document name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Document Content</label>
          <textarea
            {...register("content", { required: "Document content is required" })}
            className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter document content"
            rows="6"
          />
          {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content.message}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all ease-in-out duration-300"
          >
            Add Document
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm;
