import React, { useState } from "react";
import logo from "./assets/images/logo.jpg"; // ✅ your image
import "./style.css"; // ✅ your custom CSS

type Sections = {
  riskyOrVagueClauses?: string[];
  missingImportantClauses?: string[];
  confidentialityClause?: string;
  complianceOrLegalRisks?: string[];
  suggestionsForImprovement?: string[];
  plainLanguageSummary?: string;
};

type AnalyzeResponse = {
  sections?: Sections;
  raw?: string;
  analysis?: string;
  error?: string;
};

export default function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleAnalyze(overrideText?: string) {
  setLoading(true);
  setError(null);
  setResult(null);

  try {
    const payloadText = overrideText !== undefined ? overrideText : text;

    // ✅ Use environment variable in production
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

    const res = await fetch(`${API_BASE_URL}/api/analyze/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: payloadText }),
    });

    if (!res.ok) {
      let message = `Request failed with status ${res.status}`;
      try {
        const j = (await res.json()) as AnalyzeResponse;
        if (j?.error) message = j.error;
      } catch {
        message = await res.text();
      }
      setError(message);
      return;
    }

    const data: AnalyzeResponse = await res.json();
    setResult(data);
    if (data.error) setError(data.error);
  } catch (e) {
    setError("❌ Failed to reach backend");
  } finally {
    setLoading(false);
  }
}


  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === "string" ? reader.result : "";
      setText(content);
      handleAnalyze(content);
    };
    const lower = file.name.toLowerCase();
    const isTextLike =
      file.type.startsWith("text") ||
      lower.endsWith(".txt") ||
      lower.endsWith(".md") ||
      lower.endsWith(".rtf");
    if (!isTextLike) {
      setError("Only text/markdown/rtf files are supported right now.");
    }
    reader.readAsText(file);
  }

  return (
    <>
      {/* ---------- TOPBAR ---------- */}
<div className="topbar">
  <div className="topbar-inner">
    <div className="logo-box">
      <img src={logo} alt="Lexis Analyze Logo" className="logo-img" />
    </div>
    <div>
      <h1>LEXIS ANALYZE</h1>
      <div className="subtitle">AI Legal Intelligence</div>
    </div>
  </div>
</div>


      {/* ---------- MAIN CONTENT ---------- */}
      <div className="container">
        <div className="grid">
          {/* LEFT: Input Section */}
          <section className="card">
            <div className="helper">Paste your legal document text here…</div>
            <textarea
              className="textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your legal document text here…"
            />
            {fileName && (
              <div className="helper" style={{ marginTop: 6 }}>
                Loaded: {fileName}
              </div>
            )}
            <div className="cta-wrap">
              <button
                className="analyze-btn"
                onClick={() => handleAnalyze()}
                disabled={loading || !text.trim()}
              >
                {loading ? "ANALYZING…" : "ANALYZE DOCUMENT"}
              </button>
              <label className="upload-btn upload-inline">
                <input
                  type="file"
                  accept=".txt,.md,.rtf"
                  onChange={handleFileSelect}
                />
                <span>UPLOAD FILE</span>
              </label>
            </div>
            {error && (
              <div className="error" style={{ marginTop: 10 }}>
                {error}
              </div>
            )}
          </section>

          {/* RIGHT: Results Section */}
          <section className="card">
            <div className="results-title">ANALYSIS RESULTS</div>
            {!result?.sections && !result?.analysis && !result?.raw && !error && (
              <div className="helper">Your analysis will appear here.</div>
            )}
            {result?.sections && (
              <div className="results-grid">
                <div className="box red">
                  <h3>Risky or Vague Clauses</h3>
                  <div className="result">
                    {result.sections.riskyOrVagueClauses?.length
                      ? result.sections.riskyOrVagueClauses.map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))
                      : "—"}
                  </div>
                </div>

                <div className="box orange">
                  <h3>Missing Important Clauses</h3>
                  <div className="result">
                    {result.sections.missingImportantClauses?.length
                      ? result.sections.missingImportantClauses.map(
                          (i, idx) => <li key={idx}>{i}</li>
                        )
                      : "—"}
                  </div>
                </div>

                <div className="box blue">
                  <h3>Confidentiality Clause</h3>
                  <div className="result">
                    {result.sections.confidentialityClause || "—"}
                  </div>
                </div>

                <div className="box purple">
                  <h3>Compliance or Legal Risks</h3>
                  <div className="result">
                    {result.sections.complianceOrLegalRisks?.length
                      ? result.sections.complianceOrLegalRisks.map(
                          (i, idx) => <li key={idx}>{i}</li>
                        )
                      : "—"}
                  </div>
                </div>

                <div className="box green">
                  <h3>Suggestions for Improvement</h3>
                  <div className="result">
                    {result.sections.suggestionsForImprovement?.length
                      ? result.sections.suggestionsForImprovement.map(
                          (i, idx) => <li key={idx}>{i}</li>
                        )
                      : "—"}
                  </div>
                </div>

                <div className="box blue">
                  <h3>Plain-Language Summary</h3>
                  <div className="result">
                    {result.sections.plainLanguageSummary || "—"}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
        <footer className="footer">
          For guidance only. Not legal advice.
        </footer>
      </div>
    </>
  );
}
