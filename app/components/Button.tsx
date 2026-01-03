"use client";

import React from "react";

type ButtonProps = {
  name: string;
  color: "blue" | "gray" | "red" | "green";
};

const colorClasses = {
  blue: "bg-blue-500 hover:bg-blue-600",
  gray: "bg-gray-500 hover:bg-gray-600",
  red: "bg-red-500 hover:bg-red-600",
  green: "bg-green-500 hover:bg-green-600",
};

const Button: React.FC<ButtonProps> = ({ name, color }) => {
  return (
    <button
      className={`${colorClasses[color]} text-white font-bold py-2 px-4 rounded duration-200 transition-all animate-fade-in`}
    >
      {name}
    </button>
  );
};

export default Button;
