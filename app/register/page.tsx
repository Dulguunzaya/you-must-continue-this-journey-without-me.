"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Нууц үг таарахгүй байна");
      return;
    }

    if (!email.endsWith("@muls.edu.mn")) {
      alert("Зөвхөн muls.edu.mn и-мэйл ашиглана уу!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        router.push("/verify-otp?email=" + encodeURIComponent(email));
      } else {
        const errorMsg = data.error
          ? `${data.message}: ${data.error}`
          : data.message;
        alert(errorMsg || "Бүртгэл амжилтгүй боллоо");
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
          Create Account
        </h1>

        <p className="text-center text-gray-300 text-sm mb-8">
          Automated Billiard 🎱
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-200 mb-2 text-sm">Нэр</label>
            <input
              type="text"
              placeholder="Таны нэр"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-2 text-sm">И-мэйл</label>
            <input
              type="email"
              placeholder="name@muls.edu.mn"
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

          <div>
            <label className="block text-gray-200 mb-2 text-sm">
              Нууц үг давтах
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-green-400/40 disabled:opacity-50"
          >
            {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          Аль хэдийн бүртгэлтэй юу?{" "}
          <a
            href="/login"
            className="text-green-400 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </div>
    </section>
  );
};

export default Page;
