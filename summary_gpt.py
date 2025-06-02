import openai
from dotenv import load_dotenv
import os

# Load API key from .env
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI()

# === Define user input and mode ===
text = "The mitochondria is an organelle that produces energy in cells."
mode = "simplify"  # Options: "simplify", "summarize", "bullet", "complexify"

# === Prompt templates based on mode ===
prompt_templates = {
    "simplify": f"Simplify this academic sentence so a middle school student can understand it: {text}",
    "summarize": f"Summarize the main point of this academic text: {text}",
    "bullet": f"Turn this academic text into concise bullet points: {text}",
    "complexify": f"Rewrite this sentence in a more advanced, formal, and academic tone: {text}"
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