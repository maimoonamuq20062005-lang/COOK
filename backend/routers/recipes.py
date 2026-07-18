from fastapi import APIRouter, Query, Body

from services import spoonacular_service, gemini_service
from utils.ranking import merge_and_rank

router = APIRouter(prefix="/api/recipes", tags=["recipes"])


@router.get("/search")
def search_recipes(ingredients: str = Query(..., description="Comma-separated ingredients, e.g. chicken,rice,onion")):
    """
    Example call:
    /api/recipes/search?ingredients=chicken,rice,onion
    """
    ingredient_list = [i.strip() for i in ingredients.split(",") if i.strip()]

    if not ingredient_list:
        return {"error": "Please provide at least one ingredient."}

    spoonacular_results = spoonacular_service.search_by_ingredients(ingredient_list)
    ranked_recipes = merge_and_rank(spoonacular_results, [])

    return {
        "searched_ingredients": ingredient_list,
        "count": len(ranked_recipes),
        "recipes": ranked_recipes,
    }


# NOTE: Specific/fixed paths like /substitute and /compare MUST be defined
# BEFORE the dynamic /{recipe_id} route below. FastAPI matches routes in
# the order they're defined - if /{recipe_id} came first, it would swallow
# "/substitute" and "/compare" as if they were recipe IDs and fail trying
# to convert them to integers.

@router.get("/substitute")
def get_substitutes(ingredient: str = Query(..., description="A single ingredient name, e.g. yogurt")):
    """
    Example call:
    /api/recipes/substitute?ingredient=yogurt
    """
    if not ingredient.strip():
        return {"error": "Please provide an ingredient."}

    result = gemini_service.suggest_substitutes(ingredient.strip())
    return result


@router.post("/compare")
def compare_recipes(recipes: list[dict] = Body(..., description="List of recipes with title + nutrition to compare")):
    """
    Send a list of recipes (title + nutrition) and get back Gemini's
    comparison for weight loss, weight gain, muscle gain, and overall health.

    Example body:
    [
      {"title": "Chicken Fried Rice", "calories": 450, "protein": 30, "carbs": 40, "fat": 15},
      {"title": "Chicken Salad", "calories": 280, "protein": 35, "carbs": 10, "fat": 8}
    ]
    """
    if not recipes:
        return {"error": "Please provide at least one recipe to compare."}

    comparison = gemini_service.compare_recipes(recipes)
    return comparison


@router.get("/{recipe_id}")
def get_recipe_detail(recipe_id: int):
    """
    Called when the user clicks a specific recipe.
    Returns full method/instructions + nutrition breakdown.

    Example call:
    /api/recipes/12345
    """
    details = spoonacular_service.get_recipe_details(recipe_id)

    # Pull out just the nutrients we care about into a simple format
    nutrients = details.get("nutrition", {}).get("nutrients", [])

    def get_nutrient(name):
        match = next((n["amount"] for n in nutrients if n["name"] == name), None)
        return round(match, 1) if match is not None else None

    return {
        "id": details["id"],
        "title": details["title"],
        "image": details.get("image"),
        "servings": details.get("servings"),
        "ready_in_minutes": details.get("readyInMinutes"),
        "instructions": details.get("instructions"),
        "ingredients": [
            ing["original"] for ing in details.get("extendedIngredients", [])
        ],
        "nutrition": {
            "calories": get_nutrient("Calories"),
            "protein": get_nutrient("Protein"),
            "carbs": get_nutrient("Carbohydrates"),
            "fat": get_nutrient("Fat"),
        },
    }