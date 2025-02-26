import { useQuery } from "@tanstack/react-query";
import React from "react";
import todoServices from "../services/todo.services";

const Todos = () => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["todo"],
    queryFn: todoServices.getAllTodoService,
  });

  return (
    <section className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-4/5 sm:w-3/4 md:w-1/2 lg:w-1/3 p-6">
        {isPending && (
          <h1 className="text-3xl font-semibold text-center text-gray-600">
            Loading...
          </h1>
        )}
        {isError && (
          <h1 className="text-3xl font-semibold text-center text-red-500">
            {error.response?.data?.message || "Something went wrong!"}
          </h1>
        )}
        {!isPending && !isError && (
          <>
            {data?.data?.data.length === 0 ? (
              <h1 className="text-2xl text-center text-gray-500">
                No Data Found
              </h1>
            ) : (
              <div className="space-y-4">
                {data.data.data.map((item) => (
                  <div
                    key={item.id}
                    className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg shadow-md transition duration-200"
                  >
                    <h3 className="text-xl font-semibold text-blue-600">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 mt-2">{item.body}</p>
                    <div className="mt-2 text-right">
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Todos;
