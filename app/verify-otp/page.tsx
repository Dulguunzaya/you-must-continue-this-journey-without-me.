"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useAuth } from "../contexts/AuthContext";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { login } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);

        if (data.token && data.user) {
          login(
            { id: data.user.id, name: data.user.name, email: data.user.email },
            data.token,
          );
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } else {
        alert(data.message || "OTP баталгаажуулалт амжилтгүй боллоо");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Серверт холбогдоход алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message || "OTP дахин илгээх амжилтгүй боллоо");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Серверт холбогдоход алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          OTP Баталгаажуулалт
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {email} хаягт илгээсэн кодыг оруулна уу
        </p>

        <form className="space-y-6" onSubmit={handleVerify}>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              OTP Код
            </label>
            <input
              type="text"
              placeholder="6 оронтой кодоо оруулна уу"
              className="w-full text-black px-4 py-3 border rounded-lg text-center text-2xl tracking-widest"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Баталгаажуулж байна..." : "Баталгаажуулах"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={handleResendOTP}
            disabled={loading}
            className="text-blue-500 hover:underline disabled:opacity-50"
          >
            OTP дахин илгээх
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          <a href="/login" className="text-blue-500 hover:underline">
            Нэвтрэх хуудас руу буцах
          </a>
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
