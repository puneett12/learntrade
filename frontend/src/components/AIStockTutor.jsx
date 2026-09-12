import { useEffect, useState } from "react";

export default function AIStockTutor() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

const loadHistory = async () => {
  try {
    const res = await fetch("http://localhost:5001/api/ai-tutor/chat/history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `History request failed: ${res.status}`);
    }

    if (data.success) {
      setMessages(data.messages);
    }
  } catch (err) {
    console.error("Load history error:", err);
    setError(err.message);
  }
};

const handleAsk = async (e) => {
  e.preventDefault();

  if (!question.trim()) return;

  const userQuestion = question.trim();
  setQuestion("");
  setLoading(true);
  setError("");

  try {
    const res = await fetch("http://localhost:5001/api/ai-tutor/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question: userQuestion }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `Chat request failed: ${res.status}`);
    }

    await loadHistory();
  } catch (err) {
    console.error("Ask tutor error:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  if (!token) {
    return (
      <div className="p-4 border rounded-xl bg-white">
        <h2 className="text-2xl font-bold mb-2">AI Stock Tutor</h2>
        <p>Please login first to use the AI tutor.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="border rounded-2xl shadow-sm p-4 bg-white">
        <h2 className="text-2xl font-bold mb-2">AI Stock Tutor</h2>
        <p className="text-sm text-gray-600 mb-4">
          Ask stock market concepts in simple language.
        </p>

        <div className="h-[400px] overflow-y-auto border rounded-xl p-3 mb-4 bg-gray-50">
          {messages.length === 0 ? (
            <p className="text-gray-500">Try asking: What is P/E ratio?</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-black text-white"
                      : "bg-white border text-gray-800"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="text-sm text-gray-500">Tutor is thinking...</div>
          )}
        </div>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about stock market concepts..."
            className="flex-1 border rounded-xl px-4 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}