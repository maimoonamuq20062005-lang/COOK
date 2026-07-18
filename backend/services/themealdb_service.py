import requests

BASE_URL = "https://www.themealdb.com/api/json/v1/1"


def search_by_ingredients(ingredients: list[str]):
    """
    TheMealDB has no multi-ingredient search, so we call filter.php
    once per ingredient, then count how many of those calls each
    meal appeared in. That count becomes our 'matched_count'.

    Note: this is an approximation (TheMealDB doesn't tell us the
    recipe's FULL ingredient list from this endpoint), so
    total_ingredients is set to the number of ingredients the user
    searched with, not the recipe's true ingredient count.
    """
    # meal_id -> {"title":..., "image":..., "matched_ingredients": set()}
    meal_map = {}

    for ingredient in ingredients:
        url = f"{BASE_URL}/filter.php"
        params = {"i": ingredient.strip()}
        response = requests.get(url, params=params)

        if response.status_code != 200:
            continue  # skip this ingredient if TheMealDB hiccups, don't crash the whole search

        data = response.json()
        meals = data.get("meals") or []  # TheMealDB returns null, not [], when nothing found

        for meal in meals:
            meal_id = meal["idMeal"]
            if meal_id not in meal_map:
                meal_map[meal_id] = {
                    "title": meal["strMeal"],
                    "image": meal["strMealThumb"],
                    "matched_ingredients": set(),
                }
            meal_map[meal_id]["matched_ingredients"].add(ingredient)

    normalized = []
    total_searched = len(ingredients)
    for meal_id, info in meal_map.items():
        matched = len(info["matched_ingredients"])
        normalized.append({
            "source": "themealdb",
            "id": meal_id,
            "title": info["title"],
            "image": info["image"],
            "matched_count": matched,
            "missing_count": total_searched - matched,
            "total_ingredients": total_searched,
        })
    return normalized


def get_recipe_details(meal_id: str):
    """
    Called when the user clicks a specific TheMealDB recipe.
    Returns full instructions + raw ingredient list.
    (TheMealDB has no nutrition data - that's why Spoonacular is
    our nutrition source for recipes it covers.)
    """
    url = f"{BASE_URL}/lookup.php"
    params = {"i": meal_id}
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()
    meals = data.get("meals") or []
    return meals[0] if meals else None