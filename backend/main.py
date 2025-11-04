from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from analyzer import analyze_contract
import os

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint (optional health check)
@app.get("/")
async def root():
    return {"status": "ok"}

class TextInput(BaseModel):
    text: str
    
@app.post("/api/analyze/")
async def analyze_text(input_data: TextInput):
    if not input_data.text.strip():
        return {"error": "Text input is empty"}
    
    return analyze_contract(input_data.text)
