import Button from "./Button";

const LoginPage = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center transition-transform duration-300 hover:scale-[1.02]">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Automated Billiard
        </h1>

        <div className="flex justify-center gap-6">
          <Button name="Login" color="blue" link="/login" />
          <Button name="Register" color="gray" link="/register" />
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
