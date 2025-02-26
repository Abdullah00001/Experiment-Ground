import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import todoServices from "../services/todo.services";
import { useNavigate } from "react-router-dom";

const CreateTodos = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    body: "",
  });

  const useChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { isPending, isError, error, mutate, data } = useMutation({
    mutationFn: todoServices.createTodoService,
    mutationKey: ["todo"],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    mutate(formData);
  };

  if (data) {
    navigate("/todo");
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Todo</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={useChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date:
            </label>
            <input
              type="text"
              id="date"
              name="date"
              value={formData.date}
              onChange={useChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="body"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Body:
            </label>
            <input
              type="text"
              id="body"
              name="body"
              value={formData.body}
              onChange={useChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              disabled={isPending}
              className={`px-4 py-2 font-semibold rounded-md transition duration-300 ${
                isPending
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isPending ? "Creating..." : "Create Todo"}
            </button>
          </div>
        </form>
        {isError && (
          <div className="mt-4 text-center text-red-500">
            <p>
              Error: {error.response?.data?.message || "Something went wrong!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTodos;
