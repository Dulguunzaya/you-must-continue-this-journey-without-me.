"use client";

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login
        </h1>

        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full text-black px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Page;
