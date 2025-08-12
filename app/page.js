"use client";
import React, { useEffect, useState } from "react";
import Tasks from "./components/Tasks";
import {  toast } from "react-toastify";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
  });

  const [todoData, setTodoData] = useState([]);
  

  
  const fetchTodos = async () => {
    
    const response = await axios.get("/api");
    setTodoData(response.data.todos);
    
  };

  const handleDelete = async (mongoId) => {
    try {
      const response = await axios.delete(`/api?mongoId=${mongoId}`);
      toast.success(response.data.message);
      await fetchTodos();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleComplete = async (mongoId) => {
    const response = await axios.put(`/api?mongoId=${mongoId}`);
    toast.success(response.data.message);
    await fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api", formData);

      toast.success(response.data.message);
      setFormData({
        title: "",
        description: "",
      });
      await fetchTodos();
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const pendingTasks = todoData.filter((todo) => !todo.isCompleted);
  const completedTasks = todoData.filter((todo) => todo.isCompleted);
  return (
    <div className="pt-10 flex flex-col items-center">
      
        
          <h1 className="text-2xl  md:text-4xl font-bold mb-4">
            Welcome to TaskNest
          </h1>
          <p className="text-lg mb-8 text-gray-600">
            Your task management solution.
          </p>
          
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-2xl"
          >
            {/* Task title */}
            <input
              type="text"
              name="title"
              onChange={handleInputChange}
              value={formData.title}
              placeholder="Add a new task..."
              className="border border-gray-300 outline-0 bg-white rounded-lg px-4 py-3 w-full max-w-[800px] shadow-sm mb-4"
            />

            {/* Task description */}
            <textarea
              rows="3"
              name="description"
              type="text"
              onChange={handleInputChange}
              value={formData.description}
              placeholder="Description"
              className="border border-gray-300 outline-0 bg-white rounded-lg px-4 py-3 w-full max-w-[800px] shadow-sm mb-4"
            />

            {/* Button */}
            <button className="bg-blue-500 w-[100px] text-white px-3 py-1 rounded-sm shadow">
              Add Task
            </button>
          </form>

          {/* Task list */}
          <div className="mt-10 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-3">Your Tasks</h2>
            {pendingTasks.length === 0 && (
              <p className="text-gray-500">No Pending tasks yet.</p>
            )}

            <ul className="list-disc space-y-2 text-gray-700">
              {pendingTasks.map((todo, index) => {
                return (
                  <Tasks
                    key={index}
                    title={todo.title}
                    description={todo.description}
                    complete={todo.isCompleted}
                    mongoId={todo._id}
                    deleteTodo={handleDelete}
                    completeTodo={handleComplete}
                    fetchTodos={fetchTodos}
                  />
                );
              })}
            </ul>
          </div>

          {/* Completed Tasks section */}
          <div className="my-10 w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-3">Completed Tasks</h2>
            {completedTasks.length === 0 && (
              <p className="text-gray-500">No completed tasks yet.</p>
            )}
            <ul className="list-disc space-y-2 text-gray-700">
              {completedTasks.map((todo, index) => (
                <Tasks
                  key={index}
                  title={todo.title}
                  description={todo.description}
                  complete={todo.isCompleted}
                  mongoId={todo._id}
                  deleteTodo={handleDelete}
                  completeTodo={handleComplete}
                  fetchTodos={fetchTodos}
                />
              ))}
            </ul>
          </div>
       
      
    </div>
  );
}
