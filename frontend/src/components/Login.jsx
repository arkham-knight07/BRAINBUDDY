import React, { useState } from "react";
import api from "../services/api";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState("");
    // Forgot password states
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMsg, setForgotMsg] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);

    const handleForgotPassword = async (e) => {
      e.preventDefault();
      setForgotLoading(true);
      setForgotMsg("");
      try {
        await api.forgotPassword(forgotEmail);
        setForgotMsg("If this email exists, a reset link has been sent.");
      } catch (err) {
        setForgotMsg(err.message || "Error sending reset link.");
      }
      setForgotLoading(false);
    }  

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.login(email, password);
      setLoading(false);
      onLoginSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRegisterSuccess("");
    try {
      await api.register(email, password);
      setLoading(false);
      setRegisterSuccess("Registration successful! You can now log in.");
      setIsRegister(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={isRegister ? handleRegister : handleLogin} className="flex flex-col gap-4">
        <label className="font-semibold text-gray-700">Email</label>
        <input
          type="email"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label className="font-semibold text-gray-700">Password</label>
        <input
          type="password"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-700 transition"
          disabled={loading}
        >
          {loading ? (isRegister ? "Registering..." : "Logging in...") : (isRegister ? "Register" : "Login")}
        </button>
        <button
          type="button"
          className="text-purple-600 underline text-sm mt-2"
          onClick={() => { setIsRegister(!isRegister); setError(""); setRegisterSuccess(""); }}
        >
          {isRegister ? "Already have an account? Login" : "New user? Register here"}
        </button>
        <button
          type="button"
          className="text-purple-600 underline text-sm mt-2"
          onClick={() => { setShowForgot(true); setForgotMsg(""); }}
        >
          Forgot Password?
        </button>
        {error && <div className="text-red-500 font-semibold">{error}</div>}
        {registerSuccess && <div className="text-green-600 font-semibold">{registerSuccess}</div>}
      </form>
      {/* Forgot Password Modal/Form */}
      {showForgot && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 flex flex-col gap-4">
            <h2 className="text-lg font-bold mb-2">Reset Password</h2>
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
              <input
                type="email"
                className="border rounded px-3 py-2"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-700 transition"
                disabled={forgotLoading}
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                type="button"
                className="text-gray-500 underline text-sm"
                onClick={() => setShowForgot(false)}
              >
                Cancel
              </button>
              {forgotMsg && <div className="text-green-600 font-semibold">{forgotMsg}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;