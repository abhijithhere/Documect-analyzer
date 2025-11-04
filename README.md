# 🧾 Automated Legal Document Analyzer

This project is a web-based AI tool that reviews legal documents like contracts and agreements. It identifies potential issues such as vague terms, missing clauses, compliance risks, and offers plain-language summaries and suggestions.

> Built with **FastAPI**, **Groq LLaMA 3**, and a clean **TailwindCSS frontend**, served directly from the backend.

---

## 📌 Features

- ✍️ Accepts legal text input directly in the browser
- 🧠 Analyzes content using Groq API (LLaMA 3)
- ⚠️ Detects vague, risky, or missing clauses
- 📃 Generates plain-language summaries and suggestions
- 💡 Clean, responsive UI with Tailwind CSS
- ✅ All served from a single FastAPI backend

---

## 📂 Project Structure

legal-doc-analyzer/
├── backend/
│ ├── analyzer.py # Groq API logic
│ ├── main.py # FastAPI app
│ ├── requirements.txt # Python dependencies
│ ├── .env # Your Groq API key
│ └── static/
│ └── index.html # UI for text input and results


 ## Create Environment & Install Dependencies

python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt


## Create a file called .env in the backend/ folder:

GROQ_API_KEY=your_groq_api_key_here

## run the server

uvicorn main:app --reload


## example input :-

SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into on August 1, 2025, by and between TechNova Solutions ("Provider") and Daniel Smith ("Client").

1. Scope of Services: Provider agrees to deliver general IT consulting services, as requested by the Client, without specifying the nature, duration, or measurable outcome of such services.

2. Payment Terms: Payment will be made upon completion, amount to be determined based on mutual understanding. No exact fee or rate is agreed upon in this document.

3. Term: This Agreement is valid indefinitely unless terminated by one party. No formal termination clause or conditions are specified.

4. Liability: Provider assumes no responsibility for any direct or indirect damages arising out of this agreement, including but not limited to data loss or system downtime.

5. Dispute Resolution: Not included.

6. Confidentiality: The parties agree to verbally uphold confidentiality without signing a separate NDA.

7. Intellectual Property: No mention is made of the ownership of work product or deliverables.

This Agreement is governed by the laws of an unspecified jurisdiction.

Signed:

Provider: _____________________  
Client: _______________________
