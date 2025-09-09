import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Simple login handler for demo
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4 text-purple-700 drop-shadow-lg">BRAINBUDDY</h1>
            <p className="mb-8 text-lg text-gray-700">Welcome to BRAINBUDDY! Upload a lesson file, generate summaries, quizzes, flashcards, and export as PPT or PDF.</p>
            {!isLoggedIn ? (
                <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                    <Login onLoginSuccess={handleLoginSuccess} />
                </div>
            ) : (
                <Dashboard />
            )}
        </div>
    );
}

export default App;