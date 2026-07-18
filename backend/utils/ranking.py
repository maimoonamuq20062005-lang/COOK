def add_badge(recipe: dict) -> dict:
    """
    Adds a ✅ / 🟡 / 🔴 badge based on how many ingredients matched.
    """
    matched = recipe["matched_count"]
    total = recipe["total_ingredients"]
    ratio = matched / total if total > 0 else 0

    if ratio >= 0.8:
        badge = "✅"
    elif ratio >= 0.4:
        badge = "🟡"
    else:
        badge = "🔴"

    recipe["badge"] = badge
    recipe["badge_text"] = f"{badge} {matched}/{total} ingredients available"
    return recipe


def merge_and_rank(spoonacular_results: list[dict], themealdb_results: list[dict]) -> list[dict]:
    """
    Combines both sources into one list, adds badges, and sorts
    by ingredient match ratio (best matches first).
    """
    combined = spoonacular_results + themealdb_results

    for recipe in combined:
        add_badge(recipe)

    def match_ratio(recipe):
        total = recipe["total_ingredients"]
        return recipe["matched_count"] / total if total > 0 else 0

    combined.sort(key=match_ratio, reverse=True)
    return combined