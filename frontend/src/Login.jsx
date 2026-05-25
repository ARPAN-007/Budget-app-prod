import React, { useState } from "react";
import axios from "axios";

export default function Login({ setIsAuthenticated }) {

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // LOGIN
  // =========================

const handleLogin = async () => {

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {

    console.log("Trying login...");

    const response = await axios.post(
      "http://localhost:8000/login",
      {
        email,
        password,
      }
    );

    console.log(
      "FULL LOGIN RESPONSE:",
      response.data
    );

    // SAVE TOKEN
    localStorage.setItem(
      "token",
      response.data.access_token
    );

    // VERIFY SAVED
    setIsAuthenticated(true);

    alert("Login successful");

    window.location.reload();

  } catch (err) {

    console.log(
      "LOGIN ERROR:",
      err.response?.data || err.message
    );

    alert(
      JSON.stringify(
        err.response?.data || err.message
      )
    );
  }
};

  // =========================
  // SIGNUP
  // =========================

  const handleSignup = async () => {

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/signup",
        {
          email,
          password,
        }
      );

      console.log(
        "SIGNUP RESPONSE:",
        response.data
      );

      alert(
        "Signup successful. Please login."
      );

      setIsLogin(true);

    } catch (err) {

      console.log(
        "SIGNUP ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.detail ||
        "Signup failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-cyan-400 mb-2">
            FinPilot AI
          </h1>

          <p className="text-slate-400">
            Smart Finance Dashboard
          </p>

        </div>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
              border
              border-slate-700
              focus:outline-none
              focus:border-cyan-500
            "
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="
              w-full
              p-4
              rounded-2xl
              bg-slate-800
              text-white
              border
              border-slate-700
              focus:outline-none
              focus:border-cyan-500
            "
          />

          <button
            onClick={
              isLogin
                ? handleLogin
                : handleSignup
            }
            disabled={loading}
            className="
              w-full
              py-4
              rounded-2xl
              bg-cyan-500
              hover:bg-cyan-600
              transition-all
              text-white
              font-bold
              text-lg
            "
          >

            {loading
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Create Account"}

          </button>

        </div>

        <div className="mt-6 text-center">

          <button
            onClick={() =>
              setIsLogin(!isLogin)
            }
            className="
              text-cyan-400
              hover:text-cyan-300
            "
          >

            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}

          </button>

        </div>

      </div>

    </div>
  );
}