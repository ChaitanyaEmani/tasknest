'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Circle, CircleCheck } from 'lucide-react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Tasks = ({
  title = 'Untitled Task',
  mongoId = '',
  description = '',
  complete = false,
  deleteTodo = () => {},
  completeTodo = () => {},
  fetchTodos, // optional: function passed from parent to re-fetch tasks
}) => {
  const [editForm, setEditForm] = useState(false);
  const [formData, setFormData] = useState({ title, description });
  const router = useRouter();

  // Keep local formData in sync when parent props change
  useEffect(() => {
    setFormData({ title, description });
  }, [title, description]);

  const updateTodo = async () => {
    try {
      const response = await axios.patch(`/api?mongoId=${mongoId}`, formData);
      toast.success(response.data.message || 'Updated');
      setEditForm(false);

      // If parent provided fetchTodos(), use it. Otherwise refresh server data.
      if (typeof fetchTodos === 'function') {
        await fetchTodos();
      } else {
        router.refresh(); // app-router fallback
      }
    } catch (error) {
      console.error('updateTodo error', error);
      toast.error('Failed to update task');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      {!editForm ? (
        <div className="flex justify-between items-center border border-gray-200 p-3.5 rounded-md bg-white">
          <div className="flex gap-2">
            <div onClick={() => completeTodo(mongoId)} className="cursor-pointer">
              {complete ? (
                <CircleCheck
                  size={20}
                  className="text-green-500 cursor-pointer mt-1 hover:text-blue-600 transition duration-200"
                />
              ) : (
                <Circle
                  size={20}
                  className="text-gray-400 cursor-pointer mt-1 hover:text-blue-500 transition duration-200"
                />
              )}
            </div>

            <div className="flex flex-col">
              <h3 className="text-gray-800 font-semibold">{title}</h3>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
          </div>

          <div className="flex gap-5">
            <div
              className="cursor-pointer"
              onClick={() => {
                // prefill the form with current values and open it
                setFormData({ title, description });
                setEditForm(true);
              }}
            >
              <MdEdit color="gray" size={20} />
            </div>

            <MdDelete
              color="gray"
              size={20}
              className="cursor-pointer"
              onClick={() => deleteTodo(mongoId)}
            />
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateTodo();
          }}
          className="flex flex-col border border-gray-200 p-5 rounded-sm bg-white"
        >
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Edit task title..."
            className="border text-xs border-gray-300 outline-0 bg-white rounded-md p-2 w-full max-w-[800px] shadow-sm mb-4"
          />

          <textarea
            rows="2"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Edit description..."
            className="border border-gray-300 text-xs outline-0 bg-white rounded-md p-2 w-full max-w-[800px] shadow-sm mb-4"
          />

          <div className="flex gap-3">
            <button type="submit" className="bg-blue-500 w-[100px] text-white p-1 rounded-sm shadow">
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setEditForm(false);
                // reset to original props (optional)
                setFormData({ title, description });
              }}
              className="bg-gray-400 w-[100px] text-white p-1 rounded-sm shadow"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Tasks;
