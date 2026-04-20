import { useState } from "react";

function Login({ setIsLoggedIn }) {
  const apiBaseUrl = (
    import.meta.env.VITE_API_BASE_URL ||
    "https://curalink-backend-uusi.onrender.com"
  ).replace(/\/$/, "");
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const url = isRegister
        ? `${apiBaseUrl}/register`
        : `${apiBaseUrl}/login`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      if (!isRegister) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
      } else {
        alert("Account created!");
        setIsRegister(false);
      }

    } catch (err) {
      alert(err.message || "Unable to reach backend service");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT */}
      <div className="hidden md:flex w-1/2 bg-[#0f172a] text-white items-center justify-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">CuraLink</h1>
          <p>Modern Healthcare Management</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">

        <div className="bg-white p-8 rounded-xl shadow-lg w-80">

          <h2 className="text-2xl font-bold text-center mb-6">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          <input
            className="border p-2 w-full mb-3 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="border p-2 w-full mb-4 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="bg-teal-600 text-white w-full py-2 rounded"
          >
            {isRegister ? "Register" : "Login"}
          </button>

          <p
            className="text-sm text-center text-teal-600 mt-4 cursor-pointer"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "Already have an account? Login"
              : "New user? Register"}
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
