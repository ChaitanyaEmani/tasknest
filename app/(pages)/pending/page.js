"use client";

import React, { useEffect, useState } from "react";
import Tasks from "../../components/Tasks";
import { toast } from "react-toastify";
import axios from "axios";

const PendingPage = () => {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchPendingTasks = async () => {
    setLoading(true);
    const response = await axios.get("/api");

    setPendingTasks(
      response.data.todos.filter((todo) => todo.isCompleted === false)
    );
    setLoading(false);
  };

  const handleComplete = async (mongoId) => {
    const response = await axios.put(`/api?mongoId=${mongoId}`);
    toast.success(response.data.message);
    await fetchPendingTasks();
  };

  const handleDelete = async (mongoId) => {
    const response = await axios.delete(`/api?mongoId=${mongoId}`);
    toast.success(response.data.message);
    await fetchPendingTasks();
  };
  useEffect(() => {
    fetchPendingTasks();
  }, []);

  return (
    <div className="pt-10 flex flex-col items-center">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
      <div className="w-full flex flex-col items-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Pending Tasks</h1>
        
        <div className="my-10 w-full max-w-2xl">
          {pendingTasks.length === 0 && (
            <p className="text-gray-500 text-center">No Pending tasks yet.</p>
          )}
          <ul className="list-disc space-y-2 text-gray-700">
            {pendingTasks.map((todo, index) => (
              <Tasks
                key={index}
                title={todo.title}
                description={todo.description}
                complete={todo.isCompleted}
                deleteTodo={handleDelete}
                mongoId={todo._id}
                completeTodo={handleComplete}
                fetchTodos={fetchPendingTasks} // Pass the fetch function
              />
            ))}
          </ul>
        </div>
      </div>)}
    </div>
  );
};

export default PendingPage;
