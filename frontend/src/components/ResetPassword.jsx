import React, { useState } from "react";
import api from "../services/api";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await api.resetPassword(email, token, newPassword);
      setMsg("Password reset successful! You can now log in.");
    } catch (err) {
      setMsg(err.message || "Error resetting password.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleReset} className="bg-white p-6 rounded shadow-lg w-80 flex flex-col gap-4">
        <h2 className="text-lg font-bold mb-2">Reset Password</h2>
        <input
          type="email"
          className="border rounded px-3 py-2"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          className="border rounded px-3 py-2"
          placeholder="Reset token"
          value={token}
          onChange={e => setToken(e.target.value)}
          required
        />
        <input
          type="password"
          className="border rounded px-3 py-2"
          placeholder="New password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white font-bold py-2 rounded hover:bg-purple-700 transition"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {msg && <div className="text-green-600 font-semibold">{msg}</div>}
      </form>
    </div>
  );
}

export default ResetPassword;
