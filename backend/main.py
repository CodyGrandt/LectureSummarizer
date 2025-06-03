from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Create FastAPI app
app = FastAPI()

# Enable CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173", # local development
    "https://codygrandt.github.io" # GitHub Pages deployment
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body schema
class InputData(BaseModel):
    text: str
    mode: str

    # Test endpoint to check if the backend is running
@app.get("/")
def root():
    return {"message": "Backend is running!"}

# Prompt logic
@app.post("/process-text")
async def process_text(data: InputData):
    print(f"Received request: {data.mode} - {data.text}")

    prompt_templates = {
        "simplify": f"Simplify this academic sentence so a middle school student can understand it: {data.text}",
        "summarize": f"Summarize the main point of this academic text: {data.text}",
        "bullet": f"Turn this academic text into concise bullet points: {data.text}",
        "complexify": f"Rewrite this sentence in a more advanced, formal, and academic tone: {data.text}",
        "question": f"Create 1–2 comprehension questions based on this academic sentence: {data.text}",
        "define": f"Extract and define any key academic terms in this text: {data.text}",
        "explain_like_im_5": f"Explain this concept like I'm five: {data.text}"
    }

    prompt = prompt_templates.get(data.mode, data.text)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that processes academic text."},
            {"role": "user", "content": prompt}
        ]
    )

    return {"output": response.choices[0].message.content.strip()}
