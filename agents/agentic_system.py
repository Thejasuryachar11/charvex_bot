import os
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

BUSINESS_KEYWORDS = [
    "strategy", "business", "startup", "market", "plan",
    "growth", "saas", "product", "marketing",
    "scaling", "revenue", "execution", "roadmap",
    "automation", "ai", "technology", "operations"
]


def is_business_query(text):
    text = text.lower().strip()

    casual_inputs = [
        "hi", "hello", "hey",
        "how are you", "what's up",
        "who are you", "good morning",
        "good evening"
    ]

    if text in casual_inputs:
        return False

    if len(text.split()) < 4:
        return False

    return True


def run_agentic_system(user_input):

    if not is_business_query(user_input):
        return {
            "plan": "Not Applicable",
            "analysis": "Not Applicable",
            "final": """
This system is designed exclusively for professional, business, and strategic use cases.

Personal or casual conversations are not supported.

Please provide a business objective, strategic problem, or execution scenario.
"""
        }

    response = client.chat.completions.create(
        model="meta-llama/llama-3-8b-instruct",
        messages=[
            {
                "role": "system",
                "content": """
You are a professional multi-agent strategic AI system.

Simulate internally:
- Planner Agent
- Analyzer Agent
- Strategy Generator Agent

Produce structured output in this format:

=== PLANNER ===
...

=== ANALYSIS ===
...

=== FINAL STRATEGY ===
...

Do NOT ask questions.
Do NOT engage in casual conversation.
Business use only.
"""
            },
            {"role": "user", "content": user_input}
        ],
        temperature=0.3,
        max_tokens=900
    )

    output = response.choices[0].message.content

    return {
        "plan": extract_section(output, "PLANNER"),
        "analysis": extract_section(output, "ANALYSIS"),
        "final": extract_section(output, "FINAL STRATEGY")
    }


def extract_section(text, section_name):
    try:
        start = text.split(f"=== {section_name} ===")[1]
        return start.split("===")[0].strip()
    except:
        return text
