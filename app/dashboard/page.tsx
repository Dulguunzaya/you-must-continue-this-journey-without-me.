"use client";

import Link from "next/link";

const DashboardPage = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 blur-3xl rounded-full -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full bottom-0 right-0" />

      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
          Automated Billiard
        </h1>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-xl border border-white/30 text-white hover:bg-white/10 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold shadow hover:shadow-green-400/40 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[80vh]">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
          Smart Billiard Experience
        </h2>

        <p className="max-w-xl text-gray-300 text-lg mb-10">
          QR уншаад тогло • Автоматаар тооцоо • Хурдан • Cashless 🎱
        </p>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "QR System",
            desc: "Ширээн дээрх QR код уншаад шууд тоглоом эхлүүлнэ",
          },
          {
            title: "Auto Payment",
            desc: "Цаг автоматаар бодогдож, төлбөр хялбар",
          },
          {
            title: "Student Friendly",
            desc: "Оюутнуудад зориулсан ухаалаг шийдэл",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 text-center shadow hover:shadow-green-400/20 transition"
          >
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-gray-300 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      <footer className="relative z-10 text-center text-gray-400 text-sm pb-6">
        2026 Automated Billiard
      </footer>
    </section>
  );
};

export default DashboardPage;
