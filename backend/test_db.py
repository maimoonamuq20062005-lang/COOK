import asyncio
from prisma import Prisma


async def main():
    db = Prisma()
    await db.connect()

    # Create a test recipe
    created = await db.pakistanirecipe.create(
        data={
            "title": "Test Chicken Karahi",
            "ingredients": ["chicken", "tomato", "ginger", "garlic", "green chili"],
            "instructions": "This is just a test recipe to confirm the database connection works.",
            "category": "Curry",
            "calories": 450,
            "protein": 35,
            "carbs": 10,
            "fat": 28,
        }
    )
    print("✅ Created recipe with id:", created.id)

    # Read it back
    all_recipes = await db.pakistanirecipe.find_many()
    print(f"✅ Found {len(all_recipes)} recipe(s) in the database:")
    for r in all_recipes:
        print(f"   - {r.title} ({r.category})")

    await db.disconnect()


if __name__ == "__main__":
    asyncio.run(main())