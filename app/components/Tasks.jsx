import {  Circle, CircleCheck} from "lucide-react";
import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";

const Tasks = ({
   title = "Untitled Task",
  mongoId = "",
  description = "",
  complete = false,
  deleteTodo = () => {},
  completeTodo = () => {},
}) => {
  return (
    <div className="flex justify-between items-center border border-gray-200 p-3.5 rounded-md bg-white">
      <div className="flex gap-2">
        
        {/* Toggle complete status */}
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
        <MdEdit color="gray" size={20} className="cursor-pointer" />
        <MdDelete
          color="gray"
          size={20}
          className="cursor-pointer"
          onClick={() => deleteTodo(mongoId)}
        />
      </div>
    </div>
  );
};

export default Tasks;
