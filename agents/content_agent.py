import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_email(company):
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(
        f"Write a personalized cold email to {company} offering web development services."
    )
    return response.text
