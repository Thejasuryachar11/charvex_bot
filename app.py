from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
from agents.agentic_system import run_agentic_system

app = FastAPI()


@app.get("/", response_class=HTMLResponse)
def home():
    return """
    <html>
    <head>
        <title>Agentic AI Growth Suite</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                margin: 0;
                font-family: 'Segoe UI', sans-serif;
                background: #f4f6f9;
                color: #1f2937;
            }
            .container {
                max-width: 900px;
                margin: 80px auto;
                padding: 40px;
                background: white;
                border-radius: 12px;
                box-shadow: 0px 10px 30px rgba(0,0,0,0.08);
            }
            h1 {
                font-size: 28px;
                margin-bottom: 5px;
            }
            .subtitle {
                color: #6b7280;
                margin-bottom: 25px;
            }
            textarea {
                width: 100%;
                height: 120px;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #d1d5db;
                font-size: 15px;
                resize: none;
            }
            button {
                margin-top: 20px;
                padding: 12px 24px;
                background: #2563eb;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 15px;
                cursor: pointer;
            }
            button:hover {
                background: #1d4ed8;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                font-size: 13px;
                color: #6b7280;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Agentic AI Growth Suite</h1>
            <div class="subtitle">Multi-Agent Strategic Intelligence System</div>

            <form action="/generate" method="post">
                <textarea name="goal" placeholder="Enter your strategic objective..."></textarea>
                <button type="submit">Run Agent</button>
            </form>

            <div class="footer">
                Developed by Theja Suryachar P J
            </div>
        </div>
    </body>
    </html>
    """


@app.post("/generate", response_class=HTMLResponse)
def generate(goal: str = Form(...)):
    try:
        result = run_agentic_system(goal)

        return f"""
        <html>
        <head>
            <title>Strategic Output</title>
            <style>
                body {{
                    margin: 0;
                    font-family: 'Segoe UI', sans-serif;
                    background: #f4f6f9;
                    color: #1f2937;
                }}
                .container {{
                    max-width: 900px;
                    margin: 60px auto;
                    padding: 40px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0px 10px 30px rgba(0,0,0,0.08);
                }}
                .section {{
                    margin-bottom: 30px;
                }}
                pre {{
                    white-space: pre-wrap;
                    line-height: 1.6;
                    font-size: 15px;
                    background: #f9fafb;
                    padding: 20px;
                    border-radius: 8px;
                    overflow-x: auto;
                }}
                button {{
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: #2563eb;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 40px;
                    font-size: 13px;
                    color: #6b7280;
                }}
            </style>
        </head>
        <body>
            <div class="container">

                <div class="section">
                    <h2>🧠 Planner Agent</h2>
                    <pre>{result["plan"]}</pre>
                </div>

                <div class="section">
                    <h2>📊 Analyzer Agent</h2>
                    <pre>{result["analysis"]}</pre>
                </div>

                <div class="section">
                    <h2>🚀 Final Strategic Output</h2>
                    <pre>{result["final"]}</pre>
                </div>

                <button onclick="window.location.href='/'">Run Another</button>

                <div class="footer">
                    Developed by Theja Suryachar P J
                </div>

            </div>
        </body>
        </html>
        """

    except Exception as e:
        return f"<h3>Error: {str(e)}</h3><a href='/'>Back</a>"


last_request_time = {}

@app.middleware("http")
async def rate_limit(request: Request, call_next):
    ip = request.client.host
    now = time()

    if ip in last_request_time and now - last_request_time[ip] < 3:
        return HTMLResponse("Please wait before sending another request.")

    last_request_time[ip] = now
    return await call_next(request)