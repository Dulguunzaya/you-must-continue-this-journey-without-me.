import Button from "./Button";

const LoginPage = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 blur-3xl rounded-full -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full bottom-0 right-0" />

      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 text-center transition-all duration-500 hover:scale-[1.03] hover:shadow-green-500/20">
        <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
          Automated Billiard
        </h1>

        <p className="text-gray-300 mb-8 text-sm">Smart • Fast • Cashless 🎱</p>

        <div className="flex flex-col gap-4">
          <Button name="Login" color="green" link="/login" />
          <Button name="Register" color="gray" link="/register" />
        </div>

        <p className="text-xs text-gray-400 mt-6">© 2026 Automated Billiard</p>
      </div>
    </section>
  );
};

export default LoginPage;
