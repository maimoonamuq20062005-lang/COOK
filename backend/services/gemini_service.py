import os
import json
import time
import requests

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"


def compare_recipes(recipes: list[dict]) -> dict:
    """
    Takes a list of recipes (each with title + nutrition info) and
    asks Gemini to compare them for different health goals.

    Expects each recipe dict to look like:
    {
        "title": "Chicken Fried Rice",
        "calories": 450,
        "protein": 30,
        "carbs": 40,
        "fat": 15
    }
    """

    # Build a plain-text summary of the recipes for the prompt
    recipe_lines = []
    for r in recipes:
        recipe_lines.append(
            f"- {r['title']}: {r['calories']} kcal, "
            f"{r['protein']}g protein, {r['carbs']}g carbs, {r['fat']}g fat"
        )
    recipe_summary = "\n".join(recipe_lines)

    prompt = f"""You are a nutrition assistant. Given these recipes with their nutrition info:

{recipe_summary}

Compare them and respond ONLY with valid JSON (no markdown, no extra text) in this exact format:
{{
  "healthiest_overall": "<recipe title>",
  "best_for_weight_loss": "<recipe title>",
  "best_for_weight_gain": "<recipe title>",
  "best_for_muscle_gain": "<recipe title>",
  "summary": "<one short sentence explaining the overall comparison>"
}}
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    params = {"key": GEMINI_API_KEY}

    # Retry a couple of times if Gemini is temporarily overloaded (503)
    max_attempts = 3
    for attempt in range(1, max_attempts + 1):
        response = requests.post(GEMINI_URL, params=params, json=payload)
        if response.status_code == 503 and attempt < max_attempts:
            time.sleep(2 * attempt)  # wait a bit longer each retry
            continue
        response.raise_for_status()
        break

    data = response.json()

    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]

    # Gemini sometimes wraps JSON in ```json ... ``` even when told not to - strip that off
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        cleaned = cleaned.replace("json", "", 1).strip()

    return json.loads(cleaned)
def suggest_substitutes(ingredient: str) -> dict:
    """
    Asks Gemini for 2-3 common cooking substitutes for a single ingredient.
    """
    prompt = f"""You are a cooking assistant. Suggest 2-3 common, easy-to-find substitutes
for this ingredient: "{ingredient}"

Respond ONLY with valid JSON (no markdown, no extra text) in this exact format:
{{
  "ingredient": "{ingredient}",
  "substitutes": [
    {{"name": "<substitute name>", "note": "<short one-sentence usage tip>"}}
  ]
}}
"""

    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    params = {"key": GEMINI_API_KEY}

    max_attempts = 3
    for attempt in range(1, max_attempts + 1):
        response = requests.post(GEMINI_URL, params=params, json=payload)
        if response.status_code == 503 and attempt < max_attempts:
            time.sleep(2 * attempt)
            continue
        response.raise_for_status()
        break

    data = response.json()
    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]

    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        cleaned = cleaned.replace("json", "", 1).strip()

    return json.loads(cleaned)