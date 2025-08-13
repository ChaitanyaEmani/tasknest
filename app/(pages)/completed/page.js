"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Tasks from "../../components/Tasks";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";

const CompletedPage = () => {
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [error, setError] = useState(null);

  // Memoized task count for performance
  const taskCount = useMemo(() => completedTasks.length, [completedTasks]);

  // Optimized fetch function with error handling
  const fetchCompletedTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get("/api");
      const completed = response.data.todos.filter((todo) => todo.isCompleted);
      setCompletedTasks(completed);
    } catch (error) {
      setError("Failed to fetch completed tasks");
      toast.error("Failed to load completed tasks");
      console.error("Error fetching completed tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized delete with optimistic updates
  const handleDelete = useCallback(async (mongoId) => {
    // Store original state for rollback
    const originalTasks = completedTasks;
    
    // Optimistically update UI
    setCompletedTasks(prev => prev.filter(task => task._id !== mongoId));
    
    try {
      const response = await axios.delete(`/api?mongoId=${mongoId}`);
      toast.success(response.data.message);
    } catch (error) {
      // Rollback on error
      setCompletedTasks(originalTasks);
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  }, [completedTasks]);


  // Retry function for error states
  const handleRetry = useCallback(() => {
    fetchCompletedTasks();
  }, [fetchCompletedTasks]);

  // Initial data fetch
  useEffect(() => {
    fetchCompletedTasks();
  }, [fetchCompletedTasks]);

  // Loading state
  if (loading) {
    return (
      <div className="pt-10 flex flex-col items-center min-h-[50vh] justify-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <span className="text-gray-600 text-lg">Loading completed tasks...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-10 flex flex-col items-center min-h-[50vh] justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 flex flex-col items-center min-h-screen">
      <div className="w-full flex flex-col items-center max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
            Completed Tasks
          </h1>
          <p className="text-gray-600">
            {taskCount > 0 
              ? `Great job! You've completed ${taskCount} task${taskCount === 1 ? '' : 's'}.`
              : "Complete some tasks to see them here."
            }
          </p>
        </div>

        {/* Task Count Badge */}
        {taskCount > 0 && (
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ✅ {taskCount} Completed
            </span>
          </div>
        )}

        {/* Tasks Section */}
        <div className="w-full max-w-2xl">
          {taskCount === 0 ? (
            // Empty State
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🎯</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                No completed tasks yet
              </h3>
              <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
                Complete some tasks from your main list to see your achievements here!
              </p>
              <Link  
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
              >
                ← Back to Tasks
              </Link>
            </div>
          ) : (
            // Tasks List
            <>
              {/* Quick Actions */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-600">
                  Showing {taskCount} completed task{taskCount === 1 ? '' : 's'}
                </div>
                <button
                  onClick={fetchCompletedTasks}
                  className="text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  title="Refresh completed tasks"
                >
                  🔄 Refresh
                </button>
              </div>

              {/* Tasks Grid */}
              <div className="space-y-3">
                {completedTasks.map((todo) => (
                  <div key={todo._id} className="group">
                    <Tasks
                      title={todo.title}
                      description={todo.description}
                      complete={todo.isCompleted}
                      deleteTodo={handleDelete}
                      
                      mongoId={todo._id}
                    />
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/" 
                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                  >
                    ← Back to All Tasks
                  </Link>
                  
                  {taskCount >= 5 && (
                    <div className="text-sm text-gray-500">
                      🎉 Congratulations on completing {taskCount} tasks!
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedPage;