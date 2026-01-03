"use client";

import React from "react";
import { useRouter } from "next/navigation";

type ButtonProps = {
  name: string;
  color: "blue" | "gray" | "red" | "green";
  link: string;
};

const colorClasses = {
  blue: "bg-blue-500 hover:bg-blue-600",
  gray: "bg-gray-500 hover:bg-gray-600",
  red: "bg-red-500 hover:bg-red-600",
  green: "bg-green-500 hover:bg-green-600",
};

const Button: React.FC<ButtonProps> = ({ name, color, link }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(link);
  };

  return (
    <button
      onClick={handleClick}
      className={`${colorClasses[color]} text-white font-bold py-2 px-4 rounded transition-all duration-200 animate-fade-in`}
    >
      {name}
    </button>
  );
};

export default Button;
