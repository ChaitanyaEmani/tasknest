"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Tasks from "../../components/Tasks";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";

const PendingPage = () => {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized task count and priority stats
  const taskCount = useMemo(() => pendingTasks.length, [pendingTasks]);
  
 

  // Optimized fetch function with error handling
  const fetchPendingTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api");
      const pending = response.data.todos.filter((todo) => !todo.isCompleted);
      setPendingTasks(pending);
    } catch (error) {
      setError("Failed to fetch pending tasks");
      toast.error("Failed to load pending tasks");
      console.error("Error fetching pending tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized complete with optimistic updates
  const handleComplete = useCallback(async (mongoId) => {
    // Store original state for rollback
    const originalTasks = pendingTasks;
    
    // Optimistically remove from pending tasks
    setPendingTasks(prev => prev.filter(task => task._id !== mongoId));
    
    try {
      const response = await axios.put(`/api?mongoId=${mongoId}`);
      toast.success(response.data.message);
    } catch (error) {
      // Rollback on error
      setPendingTasks(originalTasks);
      toast.error("Failed to complete task");
      console.error("Error completing task:", error);
    }
  }, [pendingTasks]);

  // Optimized delete with optimistic updates
  const handleDelete = useCallback(async (mongoId) => {
    // Store original state for rollback
    const originalTasks = pendingTasks;
    
    // Optimistically remove from UI
    setPendingTasks(prev => prev.filter(task => task._id !== mongoId));
    
    try {
      const response = await axios.delete(`/api?mongoId=${mongoId}`);
      toast.success(response.data.message);
    } catch (error) {
      // Rollback on error
      setPendingTasks(originalTasks);
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  }, [pendingTasks]);

  // Retry function for error states
  const handleRetry = useCallback(() => {
    fetchPendingTasks();
  }, [fetchPendingTasks]);

  // Mark all as complete function
  const handleCompleteAll = useCallback(async () => {
    if (taskCount === 0) return;
    
    const originalTasks = pendingTasks;
    
    // Optimistically clear all pending tasks
    setPendingTasks([]);
    
    try {
      // Complete all tasks (you might need to implement this API endpoint)
      const promises = pendingTasks.map(task => 
        axios.put(`/api?mongoId=${task._id}`)
      );
      
      await Promise.all(promises);
      toast.success(`Completed all ${taskCount} tasks! 🎉`);
    } catch (error) {
      // Rollback on error
      setPendingTasks(originalTasks);
      toast.error("Failed to complete all tasks");
      console.error("Error completing all tasks:", error);
    }
  }, [pendingTasks, taskCount]);

  // Initial data fetch
  useEffect(() => {
    fetchPendingTasks();
  }, [fetchPendingTasks]);

  // Loading state
  if (loading) {
    return (
      <div className="pt-10 flex flex-col items-center min-h-[50vh] justify-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-gray-600 text-lg">Loading pending tasks...</span>
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
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
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
            Pending Tasks
          </h1>
          <p className="text-gray-600">
            {taskCount > 0 
              ? `You have ${taskCount} task${taskCount === 1 ? '' : 's'} waiting to be completed.`
              : "No pending tasks! Time to add some new ones or take a break."
            }
          </p>
        </div>

        {/* Task Stats & Actions */}
        {taskCount > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
            {/* Stats Badge */}
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                📋 {taskCount} Pending
              </span>
              
            </div>
            
            {/* Complete All Button */}
            {taskCount > 1 && (
              <button
                onClick={handleCompleteAll}
                className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors duration-200"
                title={`Complete all ${taskCount} tasks`}
              >
                ✅ Complete All ({taskCount})
              </button>
            )}
          </div>
        )}

        {/* Tasks Section */}
        <div className="w-full max-w-2xl">
          {taskCount === 0 ? (
            // Empty State
            <div className="text-center py-16">
              <div className="text-8xl mb-6">✨</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                All caught up!
              </h3>
              <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
                You have no pending tasks. Great job! Ready to add some new ones?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/" 
                  className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  ➕ Add New Task
                </Link>
                <a 
                  href="/completed" 
                  className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-medium"
                >
                  🎯 View Completed
                </a>
              </div>
            </div>
          ) : (
            // Tasks List
            <>
              {/* Quick Actions Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-600">
                  Showing {taskCount} pending task{taskCount === 1 ? '' : 's'}
                </div>
                <button
                  onClick={fetchPendingTasks}
                  className="text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  title="Refresh pending tasks"
                >
                  🔄 Refresh
                </button>
              </div>

              {/* Progress Motivation */}
              {taskCount > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-blue-800 text-sm">
                    💪 <strong>Keep going!</strong> {
                      taskCount === 1 
                        ? "Just one task left to complete!" 
                        : taskCount <= 3 
                          ? `Only ${taskCount} tasks to go!`
                          : `You've got ${taskCount} tasks to tackle. Take them one at a time!`
                    }
                  </p>
                </div>
              )}

              {/* Tasks Grid */}
              <div className="space-y-3">
                {pendingTasks.map((todo, index) => (
                  <div 
                    key={todo._id} 
                    className="group transform transition-all duration-200 hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Tasks
                      title={todo.title}
                      description={todo.description}
                      complete={todo.isCompleted}
                      deleteTodo={handleDelete}
                      completeTodo={handleComplete}
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
                  
                  <Link
                    href="/completed" 
                    className="inline-flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors duration-200"
                  >
                    View Completed Tasks →
                  </Link>
                </div>
                
                {/* Productivity Tip */}
                {taskCount >= 5 && (
                  <div className="mt-4 text-sm text-gray-500">
                    💡 <strong>Tip:</strong> Break large tasks into smaller ones for better progress tracking!
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingPage;