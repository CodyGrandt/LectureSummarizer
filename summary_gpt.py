import openai
from dotenv import load_dotenv
import os

load_dotenv()
openai.api_key= os.getenv("OPENAI_API_KEY")
client = openai.OpenAI()

# Call the GPT model
response = client.chat.completions.create(
    model="gpt-3.5-turbo",  # or "gpt-4"
    messages=[
        {"role": "system", "content": "You are a helpful assistant that simplifies academic text."},
        {"role": "user", "content": "Simplify this: The mitochondria is an organelle that produces energy in cells."}
    ]
)

print("Simplified:", response.choices[0].message.content)
