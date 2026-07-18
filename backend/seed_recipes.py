import asyncio
from prisma import Prisma

# Starter batch - add more dishes to this list anytime and re-run the script.
# Only NEW titles will be added (the script skips ones already in the database).
RECIPES = [
    {
        "title": "Chicken Karahi",
        "ingredients": ["chicken", "tomato", "ginger", "garlic", "green chili", "yogurt", "oil"],
        "instructions": (
            "Heat oil in a karahi/wok. Add ginger-garlic paste and saute until fragrant. "
            "Add chicken pieces and cook until browned. Add chopped tomatoes and cook until soft "
            "and oil separates. Stir in yogurt, green chilies, and salt. Cover and simmer until "
            "chicken is fully cooked and the gravy thickens. Garnish with ginger juliennes and "
            "fresh coriander before serving."
        ),
        "category": "Curry",
        "calories": 420, "protein": 34, "carbs": 8, "fat": 27,
    },
    {
        "title": "Chicken Biryani",
        "ingredients": ["chicken", "basmati rice", "onion", "yogurt", "tomato", "biryani masala", "potato"],
        "instructions": (
            "Marinate chicken in yogurt and biryani masala. Fry sliced onions until golden and set aside. "
            "Cook the marinated chicken with tomatoes until done, forming a thick masala. "
            "Parboil basmati rice separately with whole spices. Layer the cooked chicken masala and "
            "rice alternately in a large pot, topping with fried onions and fresh coriander. "
            "Cover tightly and cook on low heat (dum) for 20-25 minutes before mixing gently and serving."
        ),
        "category": "Rice",
        "calories": 520, "protein": 28, "carbs": 62, "fat": 18,
    },
    {
        "title": "Daal Chawal (Lentils and Rice)",
        "ingredients": ["red lentils", "rice", "onion", "tomato", "garlic", "cumin", "turmeric"],
        "instructions": (
            "Boil lentils with turmeric and salt until soft. In a separate pan, prepare a tarka by "
            "frying sliced onions, garlic, and cumin seeds in oil until golden. Add tomatoes and cook "
            "until soft, then pour this tarka over the boiled lentils and simmer for 5 minutes. "
            "Serve hot with plain steamed rice."
        ),
        "category": "Lentils",
        "calories": 310, "protein": 14, "carbs": 52, "fat": 6,
    },
    {
        "title": "Seekh Kebab",
        "ingredients": ["ground beef", "onion", "green chili", "coriander", "cumin", "garam masala"],
        "instructions": (
            "Mix ground beef with finely chopped onion, green chilies, fresh coriander, and spices. "
            "Knead the mixture well until sticky. Shape into long kebabs around skewers. "
            "Grill or pan-fry until fully cooked and charred on the outside. Serve with naan and chutney."
        ),
        "category": "BBQ",
        "calories": 380, "protein": 26, "carbs": 4, "fat": 29,
    },
    {
        "title": "Aloo Gosht (Meat and Potato Curry)",
        "ingredients": ["beef", "potato", "onion", "tomato", "ginger", "garlic", "yogurt"],
        "instructions": (
            "Saute onions until golden, add ginger-garlic paste and cook briefly. Add beef pieces and "
            "brown on all sides. Stir in tomatoes and spices, cooking until oil separates. Add water and "
            "pressure cook until meat is tender. Add potato chunks and cook until soft. Simmer until "
            "the gravy thickens to your liking."
        ),
        "category": "Curry",
        "calories": 410, "protein": 24, "carbs": 22, "fat": 24,
    },
]


async def main():
    db = Prisma()
    await db.connect()

    existing = await db.pakistanirecipe.find_many()
    existing_titles = {r.title for r in existing}

    added = 0
    for recipe in RECIPES:
        if recipe["title"] in existing_titles:
            print(f"⏭️  Skipping '{recipe['title']}' - already in database")
            continue

        await db.pakistanirecipe.create(data=recipe)
        print(f"✅ Added '{recipe['title']}'")
        added += 1

    print(f"\nDone. {added} new recipe(s) added.")
    await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())