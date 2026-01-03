import React from "react";
import Button from "../components/Button";

const page = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-white animate-fade-in duration-200">
      <div className="w-[500px] h-[650px] bg-gray-400 border-2 border-black rounded-lg">
        <div className="text-center text-3xl pt-6">Automated Billiard</div>
        <div className="flex justify-center items-center gap-5 mt-10">
          <Button name="Login" color="blue" link="/login"/>
          <Button name="Register" color="gray" link="/register"/>
        </div>
      </div>
    </div>
  );
};

export default page;
