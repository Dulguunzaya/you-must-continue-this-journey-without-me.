"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../app/contexts/AuthContext";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsVerification && data.email) {
          alert(data.message);
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
          return;
        }
        alert(data.message || "Нэвтрэх амжилтгүй боллоо");
        return;
      }

      if (data.token && data.user) {
        login(
          { id: data.user.id, name: data.user.name, email: data.user.email },
          data.token,
        );
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Серверт холбогдоход алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 blur-3xl rounded-full -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full bottom-0 right-0" />

      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
          Automated Billiard
        </h1>

        <p className="text-center text-gray-300 text-sm mb-8">
          Smart • Fast • Cashless 🎱
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-200 mb-2 text-sm">И-мэйл</label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-2 text-sm">Нууц үг</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-green-400/40 disabled:opacity-50"
          >
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>
        </form>

        <div className="text-center mt-4">
          <a
            href="/forgot-password"
            className="text-sm text-gray-300 hover:text-green-400 transition"
          >
            Нууц үгээ мартсан уу?
          </a>
        </div>

        <p className="text-center text-sm text-gray-300 mt-6">
          Бүртгэлгүй юу?{" "}
          <a
            href="/register"
            className="text-green-400 hover:underline font-medium"
          >
            Register
          </a>
        </p>
      </div>
    </section>
  );
};

export default Page;
