"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/contexts/AuthContext";
import { useEffect, useState } from "react";

interface Table {
  _id: string;
  name: string;
  status: "AVAILABLE" | "PLAYING" | "DISABLED";
  pricePerMinute: number;
}

interface ActiveSession {
  _id: string;
  tableId: Table;
  startTime: string;
  currentCost: number;
  durationInMinutes: number;
}

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchAvailableTables();
      fetchActiveSession();
    }
  }, [user]);

  const fetchAvailableTables = async () => {
    try {
      const response = await fetch("/api/user/tables/available", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tables");
      }

      const data = await response.json();
      setTables(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveSession = async () => {
    try {
      const response = await fetch("/api/user/sessions/active", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.session) {
          setActiveSession(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch active session:", err);
    }
  };

  const handleBookTable = async (tableId: string) => {
    try {
      const response = await fetch(`/api/user/tables/${tableId}/book`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to book table");
      }

      await fetchAvailableTables();
      await fetchActiveSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book table");
    }
  };

  const handleStopSession = async () => {
    try {
      const response = await fetch("/api/user/sessions/stop", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to stop session");
      }

      setActiveSession(null);
      await fetchAvailableTables();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stop session");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Please login to access dashboard</div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 blur-3xl rounded-full -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full bottom-0 right-0" />

      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
          Automated Billiard
        </h1>

        <div className="flex gap-4 items-center">
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-purple-500 text-white font-semibold shadow hover:shadow-purple-400/40 transition"
            >
              Admin Panel
            </Link>
          )}
          <span className="px-5 py-2 text-white">{user.name}</span>
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl border border-white/30 text-white hover:bg-red-500/20 hover:border-red-400 transition"
          >
            Гарах
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        {/* Active Session Section */}
        {activeSession && (
          <div className="mb-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Active Session
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-300 text-sm">Table</p>
                <p className="text-white text-lg font-semibold">
                  {activeSession.tableId.name}
                </p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Duration</p>
                <p className="text-white text-lg font-semibold">
                  {activeSession.durationInMinutes} min
                </p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Current Cost</p>
                <p className="text-white text-lg font-semibold">
                  ${activeSession.currentCost.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={handleStopSession}
              className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-red-400 to-red-500 text-white font-semibold shadow hover:shadow-red-400/40 transition"
            >
              Stop Session
            </button>
          </div>
        )}

        {/* Available Tables Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Available Tables
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button onClick={() => setError("")} className="float-right">
                &times;
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-white">Loading tables...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tables.map((table) => (
                <div
                  key={table._id}
                  className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 hover:shadow-green-400/20 transition"
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    {table.name}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    ${table.pricePerMinute}/minute
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-4">
                    AVAILABLE
                  </span>
                  <button
                    onClick={() => handleBookTable(table._id)}
                    disabled={!!activeSession}
                    className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold shadow hover:shadow-green-400/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {activeSession ? "Session Active" : "Book Table"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {!loading && tables.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-300">
                No available tables at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <h3 className="text-xl font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="relative z-10 text-center text-gray-400 text-sm pb-6">
        © 2026 Automated Billiard 🎱
      </footer>
    </section>
  );
};

export default DashboardPage;
