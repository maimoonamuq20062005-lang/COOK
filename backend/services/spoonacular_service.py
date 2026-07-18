import os
import time
import requests

SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")
BASE_URL = "https://api.spoonacular.com/recipes"


def _get_with_retry(url, params, max_attempts=3):
    """
    Wraps requests.get with retries for transient network issues
    (e.g. intermittent DNS resolution failures on flaky connections).
    """
    last_error = None
    for attempt in range(1, max_attempts + 1):
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 402:
                # Spoonacular's free daily quota (150 requests/day) has been used up.
                # This isn't transient - retrying won't help, fail clearly instead.
                raise SpoonacularQuotaError(
                    "Daily recipe search limit reached. Please try again tomorrow, "
                    "or check your Spoonacular dashboard for quota reset time."
                )
            response.raise_for_status()
            return response
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout) as e:
            last_error = e
            if attempt < max_attempts:
                time.sleep(1.5 * attempt)  # wait a bit longer each retry
                continue
    raise last_error


class SpoonacularQuotaError(Exception):
    """Raised when Spoonacular's free-tier daily quota is exhausted (402)."""
    pass


def search_by_ingredients(ingredients: list[str], number: int = 10):
    """
    Calls Spoonacular's findByIngredients endpoint.
    Spoonacular already tells us exactly how many of the user's
    ingredients are used vs missing - no manual counting needed.
    """
    url = f"{BASE_URL}/findByIngredients"
    params = {
        "ingredients": ",".join(ingredients),
        "number": number,
        "ranking": 1,          # 1 = maximize used ingredients
        "ignorePantry": True,  # ignore salt/water/oil etc when counting
        "apiKey": SPOONACULAR_API_KEY,
    }

    response = _get_with_retry(url, params)
    results = response.json()

    normalized = []
    for r in results:
        normalized.append({
            "source": "spoonacular",
            "id": r["id"],
            "title": r["title"],
            "image": r.get("image"),
            "matched_count": r["usedIngredientCount"],
            "missing_count": r["missedIngredientCount"],
            "total_ingredients": r["usedIngredientCount"] + r["missedIngredientCount"],
        })
    return normalized


def get_recipe_details(recipe_id: int):
    """
    Called when the user clicks a specific Spoonacular recipe.
    Returns full instructions + nutrition.
    """
    url = f"{BASE_URL}/{recipe_id}/information"
    params = {
        "includeNutrition": True,
        "apiKey": SPOONACULAR_API_KEY,
    }
    response = _get_with_retry(url, params)
    return response.json()