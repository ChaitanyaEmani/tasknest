'use client'

import React, { useEffect, useState } from 'react'
import Tasks from '../../components/Tasks'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const CompletedPage = () => {

    const [completedTasks, setCompletedTasks] = useState([]);

    const fetchCompletedTasks = async ()=>{
        const response = await axios.get('/api');
        
        setCompletedTasks(response.data.todos.filter(todo => todo.isCompleted));
    }

    const handleDelete = async (mongoId)=>{
        const response = await axios.delete(`/api?mongoId=${mongoId}`);
        toast.success(response.data.message);
        await fetchCompletedTasks();
    }
    useEffect(()=>{
        fetchCompletedTasks();
    },[]);

  return (
    <div className="pt-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Completed Tasks</h1>
      <ToastContainer theme="dark" />
      <div className="my-10 w-full max-w-2xl">
        {completedTasks.length === 0 && (
          <p className="text-gray-500 text-center">No Completed tasks yet.</p>
        )}
        <ul className="list-disc space-y-2 text-gray-700">
          {completedTasks.map((todo, index) => (
            <Tasks
              key={index}
              title={todo.title}
              description={todo.description}
                complete={todo.isCompleted}
                deleteTodo={handleDelete}
              mongoId={todo._id}
              
            />
          ))}
        </ul>
      </div>
    </div>
  );
  
}

export default CompletedPage