import React, { useState } from "react";
import api from "../services/api";
import { FileText, ListChecks, HelpCircle, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [summary, setSummary] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage("");
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.uploadFile(file);
      setUploadMessage(res.message);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleSummarize = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.summarize();
      setSummary(res.summary);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleQuiz = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.generateQuiz();
      setQuiz(res.quiz);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.askQuestion(question);
      setAnswer(res.answer);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleExportPPT = async () => {
    setLoading(true);
    setError("");
    try {
      await api.exportPPT();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8 mt-4 flex flex-col gap-8 border border-purple-100"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 className="text-3xl font-extrabold text-purple-700 mb-2 flex items-center gap-2"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ListChecks className="w-8 h-8 text-purple-500" /> Dashboard
      </motion.h2>
      <form onSubmit={handleUpload} className="flex flex-col gap-3 bg-purple-50 rounded-lg p-4 shadow">
        <label className="font-semibold text-gray-700 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" /> Upload Lesson File (PDF/Text)
        </label>
        <input type="file" accept=".pdf,.txt" onChange={handleFileChange} className="border rounded px-3 py-2" />
        <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition" disabled={loading || !file}>
          {loading ? "Uploading..." : "Upload"}
        </motion.button>
        <AnimatePresence>
          {uploadMessage && (
            <motion.div className="text-green-600 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {uploadMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      <div className="flex gap-4 justify-center">
        <motion.button onClick={handleSummarize} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition shadow" disabled={loading}>
          <ListChecks className="w-5 h-5" /> Summarize
        </motion.button>
        <motion.button onClick={handleQuiz} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition shadow" disabled={loading}>
          <HelpCircle className="w-5 h-5" /> Generate Quiz
        </motion.button>
        <motion.button onClick={handleExportPPT} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 bg-pink-600 text-white font-bold py-2 px-4 rounded hover:bg-pink-700 transition shadow" disabled={loading}>
          <Download className="w-5 h-5" /> Export PPT
        </motion.button>
      </div>
      <AnimatePresence>
        {summary.length > 0 && (
          <motion.div className="bg-purple-50 rounded-lg p-4 shadow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <h3 className="text-xl font-bold text-purple-600 mb-2">Summary</h3>
            <ul className="list-disc ml-6 text-gray-800">
              {summary.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {quiz.length > 0 && (
          <motion.div className="bg-indigo-50 rounded-lg p-4 shadow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Quiz Questions</h3>
            <ul className="list-decimal ml-6 text-gray-800">
              {quiz.map((q, idx) => (
                <li key={idx} className="mb-2">
                  <div className="font-semibold">{q.question}</div>
                  <ul className="ml-4">
                    {q.options.map((opt, i) => (
                      <li key={i}>{String.fromCharCode(65 + i)}) {opt}</li>
                    ))}
                  </ul>
                  <div className="text-green-600">Correct: {q.correct_answer}</div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <form onSubmit={handleAsk} className="flex flex-col gap-3 mt-4 bg-teal-50 rounded-lg p-4 shadow">
        <label className="font-semibold text-gray-700 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-400" /> Ask a Question
        </label>
        <input
          type="text"
          className="border rounded px-3 py-2"
          placeholder="Type your question..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
        <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="bg-teal-600 text-white font-bold py-2 rounded hover:bg-teal-700 transition" disabled={loading || !question}>
          Ask
        </motion.button>
        <AnimatePresence>
          {answer && <motion.div className="text-blue-700 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Answer: {answer}
          </motion.div>}
        </AnimatePresence>
      </form>
      {error && <motion.div className="text-red-500 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {error}
      </motion.div>}
    </motion.div>
  );
}

export default Dashboard;