import requests

def research_startups(city, niche):
    # For MVP we mock data
    return [
        {"name": "TechNova", "city": city, "niche": niche},
        {"name": "CloudEdge", "city": city, "niche": niche}
    ]
