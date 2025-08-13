"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Tasks from "./components/Tasks";
import { toast } from "react-toastify";
import axios from "axios";

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [todoData, setTodoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoized computed values
  const pendingTasks = useMemo(
    () => todoData.filter((todo) => !todo.isCompleted),
    [todoData]
  );
  
  const completedTasks = useMemo(
    () => todoData.filter((todo) => todo.isCompleted),
    [todoData]
  );

  // Fetch todos with loading state
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api");
      setTodoData(response.data.todos);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error("Error fetching todos:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized delete with optimistic updates
  const handleDelete = useCallback(async (mongoId) => {
    // Optimistically remove from UI
    const originalTodos = todoData;
    setTodoData(prev => prev.filter(todo => todo._id !== mongoId));
    
    try {
      const response = await axios.delete(`/api?mongoId=${mongoId}`);
      toast.success(response.data.message);
    } catch (error) {
      // Revert on error
      setTodoData(originalTodos);
      toast.error("Failed to delete task");
      console.error("Error deleting todo:", error);
    }
  }, [todoData]);

  // Optimized complete with optimistic updates
  const handleComplete = useCallback(async (mongoId) => {
    // Optimistically update UI
    const originalTodos = todoData;
    setTodoData(prev =>
      prev.map(todo =>
        todo._id === mongoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );

    try {
      const response = await axios.put(`/api?mongoId=${mongoId}`);
      toast.success(response.data.message);
    } catch (error) {
      // Revert on error
      setTodoData(originalTodos);
      toast.error("Failed to update task");
      console.error("Error updating todo:", error);
    }
  }, [todoData]);

  // Initial data fetch
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Memoized input change handler
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Enhanced form submission with validation
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (formData.title.trim().length > 100) {
      toast.error("Task title must be less than 100 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api", {
        title: formData.title.trim(),
        description: formData.description.trim(),
      });

      toast.success(response.data.message);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
      });
      
      // Add new todo optimistically
      if (response.data.todo) {
        setTodoData(prev => [...prev, response.data.todo]);
      } else {
        // Fallback to refetch if todo not returned
        await fetchTodos();
      }
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Error creating todo:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, fetchTodos]);

  // Keyboard shortcut handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setFormData({ title: "", description: "" });
    }
  }, []);

  return (
    <div className="pt-10 flex flex-col items-center" onKeyDown={handleKeyDown}>
      <h1 className="text-2xl md:text-4xl font-bold mb-4">
        Welcome to TaskNest
      </h1>
      <p className="text-lg mb-8 text-gray-600">
        Your task management solution.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-2xl"
        noValidate
      >
        {/* Task title */}
        <input
          type="text"
          name="title"
          onChange={handleInputChange}
          value={formData.title}
          placeholder="Add a new task..."
          className="border border-gray-300 outline-0 bg-white rounded-lg px-4 py-3 w-full max-w-[800px] shadow-sm mb-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          maxLength={100}
          required
          disabled={isSubmitting}
        />

        {/* Task description */}
        <textarea
          rows="3"
          name="description"
          onChange={handleInputChange}
          value={formData.description}
          placeholder="Description (optional)"
          className="border border-gray-300 outline-0 bg-white rounded-lg px-4 py-3 w-full max-w-[800px] shadow-sm mb-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
          maxLength={500}
          disabled={isSubmitting}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.title.trim()}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed w-[100px] text-white px-3 py-2 rounded-lg shadow transition-colors duration-200"
        >
          {isSubmitting ? "Adding..." : "Add Task"}
        </button>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading tasks...</span>
        </div>
      )}

      {/* Task Statistics */}
      {!isLoading && todoData.length > 0 && (
        <div className="mt-8 flex gap-4 text-sm text-gray-600">
          <span>Total: {todoData.length}</span>
          <span>Pending: {pendingTasks.length}</span>
          <span>Completed: {completedTasks.length}</span>
        </div>
      )}

      {/* Pending Tasks */}
      {!isLoading && (
        <div className="mt-10 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-3">
            Your Tasks {pendingTasks.length > 0 && `(${pendingTasks.length})`}
          </h2>
          
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No pending tasks yet.</p>
              <p className="text-gray-400 text-sm mt-2">
                Add a task above to get started! 🚀
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {pendingTasks.map((todo) => (
                <Tasks
                  key={todo._id}
                  title={todo.title}
                  description={todo.description}
                  complete={todo.isCompleted}
                  mongoId={todo._id}
                  deleteTodo={handleDelete}
                  completeTodo={handleComplete}
                />
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Completed Tasks */}
      {!isLoading && completedTasks.length > 0 && (
        <div className="my-10 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-3">
            Completed Tasks ({completedTasks.length})
          </h2>
          
          <ul className="space-y-3">
            {completedTasks.map((todo) => (
              <Tasks
                key={todo._id}
                title={todo.title}
                description={todo.description}
                complete={todo.isCompleted}
                mongoId={todo._id}
                deleteTodo={handleDelete}
                completeTodo={handleComplete}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && todoData.length === 0 && (
        <div className="mt-16 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No tasks yet
          </h3>
          <p className="text-gray-500">
            Create your first task to start organizing your day!
          </p>
        </div>
      )}
    </div>
  );
}