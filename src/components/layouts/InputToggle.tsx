import React from "react";

interface InputToggleProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const InputToggle: React.FC<InputToggleProps> = ({ value, onChange, options }) => {
  return (
    <div className="inline-flex border rounded-md overflow-hidden">
      {options.map((option) => {
        const isActive = value === option;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors duration-200
              ${isActive ? "bg-blue-500 text-white" : "bg-white text-black"}
              ${!isActive ? "hover:bg-gray-100" : ""}
              focus:outline-none`}
            >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default InputToggle;