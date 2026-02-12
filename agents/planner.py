import os
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def planner_agent(user_input):
    response = client.chat.completions.create(
        model="meta-llama/llama-3-8b-instruct",
        messages=[
            {
                "role": "system",
                "content": """
                You are an autonomous strategic planning AI agent.

                Your task:
                - Do NOT ask follow-up questions.
                - Do NOT request clarification.
                - Assume reasonable business context.
                - Break the objective into structured execution steps.
                - Output must be professional and decisive.
                """
            },
            {"role": "user", "content": user_input}
        ],
    )
    return response.choices[0].message.content


def analyzer_agent(plan_output):
    response = client.chat.completions.create(
        model="meta-llama/llama-3-8b-instruct",
        messages=[
            {
                "role": "system",
                "content": """
                You are a risk and opportunity analysis AI agent.

                Your task:
                - Analyze the provided strategic plan.
                - Identify risks, bottlenecks, and optimization opportunities.
                - Provide insights.
                - Do NOT ask questions.
                - Be decisive and analytical.
                """
            },
            {"role": "user", "content": plan_output}
        ],
    )
    return response.choices[0].message.content


def generator_agent(user_input, analysis):
    response = client.chat.completions.create(
        model="meta-llama/llama-3-8b-instruct",
        messages=[
            {
                "role": "system",
                "content": """
                You are a senior executive AI strategist.

                Deliver:
                1. Executive Summary
                2. Strategic Roadmap
                3. Risk Mitigation Strategy
                4. Implementation Timeline
                5. Expected Business Impact

                Do NOT ask questions.
                Do NOT be conversational.
                Write in a board-level professional tone.
                """
            },
            {
                "role": "user",
                "content": f"Objective: {user_input}\n\nAnalysis: {analysis}"
            }
        ],
    )
    return response.choices[0].message.content


def run_agentic_system(user_input):
    plan = planner_agent(user_input)
    analysis = analyzer_agent(plan)
    final_output = generator_agent(user_input, analysis)

    return {
        "plan": plan,
        "analysis": analysis,
        "final": final_output
    }
