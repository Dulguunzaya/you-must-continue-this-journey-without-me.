"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const user = {
    username,
    email,
    password,
  };
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  const save = localStorage.setItem("user", JSON.stringify(user));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Register
        </h1>

        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 text-black py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-3 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition duration-200"
            onSelect={() => {
              handleClick();
            }}
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page;
