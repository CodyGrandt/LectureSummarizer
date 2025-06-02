import openai
from dotenv import load_dotenv
import os

# Load API key from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI()

# === Define user input and mode ===
text = "The mitochondria is an organelle that produces energy in cells."
mode = "eli5"  # Options: simplify, summarize, bullet, complexify, question, definition, eli5

# === Prompt templates based on mode ===
prompt_templates = {
    "simplify": f"Simplify this academic sentence so a middle school student can understand it: {text}",
    "summarize": f"Summarize the main point of this academic text: {text}",
    "bullet": f"Turn this academic text into concise bullet points: {text}",
    "complexify": f"Rewrite this sentence in a more advanced, formal, and academic tone: {text}",
    "question": f"Generate a few quiz-style questions based on this academic text: {text}",
    "definition": f"Identify any key terms in the following and provide simple definitions: {text}",
    "eli5": f"Explain this as if I'm five years old: {text}"
}

# === Call GPT with selected prompt ===
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a helpful assistant that processes academic text."},
        {"role": "user", "content": prompt_templates[mode]}
    ]
)

# === Output the result ===
print(f"\nMode: {mode.capitalize()}\nOutput:", response.choices[0].message.content.strip())