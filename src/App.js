import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedEmail("");

    if (!prompt || !recipient || !subject) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://ai-email-generator-psi.vercel.app/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, recipient, subject }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setGeneratedEmail(data.email_body);
    } catch (err) {
      setError("Failed to generate email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-500 mb-6">
          AI Email Generator
        </h1>

        <form
          onSubmit={handleGenerate}
          className="bg-slate-800 p-8 rounded-2xl shadow-lg mb-8"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sky-300 font-semibold mb-2">
                Recipient
              </label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="recipient@example.com"
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600"
                required
              />
            </div>
            <div>
              <label className="block text-sky-300 font-semibold mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email Subject"
                className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sky-300 font-semibold mb-2">
              Email Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Write a formal email to a client..."
              rows="5"
              className="w-full p-3 bg-slate-700 text-white rounded-lg border border-slate-600 resize-y"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-teal-400 hover:to-sky-500 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Email"}
          </button>
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </form>

        {generatedEmail && (
          <div className="bg-slate-800 p-8 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-sky-300 mb-4">
              Generated Email
            </h2>
            <div className="bg-slate-700 p-6 rounded-lg border border-slate-600 whitespace-pre-wrap">
              <p>To: {recipient}</p>
              <p>Subject: {subject}</p>
              <hr className="my-4 border-slate-600" />
              <p>{generatedEmail}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;







