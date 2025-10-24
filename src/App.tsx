import React, { useState } from "react";
import "./app.css";
export default function TriviaApp() {
  const [question, setQuestion] = useState<string | null>(null);
  const [message, setMessage] = useState(
    "Click the button to get a trivia question!"
  );
  const [loading, setLoading] = useState(false);

  const fetchTrivia = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("https://opentdb.com/api.php?amount=1");

      // Rajaa kysymysten määrä API-kutsussa
      if (response.status === 429) {
        setQuestion(null);
        setMessage("Please try again in a moment.");
        return;
      }

      if (!response.ok) {
        setQuestion(null);
        setMessage("An error occurred. Please try again later.");
        return;
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        // Käytä DOMParseria HTML-entiteettien purkamiseen
        const parser = new DOMParser();
        const decodedQuestion = parser.parseFromString(
          data.results[0].question,
          "text/html"
        ).body.textContent;

        setQuestion(decodedQuestion);
        setMessage("");
      } else {
        setMessage("No question found. Try again!");
      }
    } catch (error) {
      console.error("Error fetching trivia:", error);
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-2xl font-bold mb-6"> Welcome to Trivia API!</h1>

      {loading ? (
        <p className="text-gray-600 mb-4">Loading...</p>
      ) : message ? (
        <p className="text-gray-700 mb-4">{message}</p>
      ) : (
        <p className="text-lg font-medium mb-4">{question}</p>
      )}

      <button
        onClick={fetchTrivia}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition disabled:opacity-50"
      >
        Get Trivia Question
      </button>
    </div>
  );
}
