from dotenv import load_dotenv
load_dotenv()  # must run before any service reads os.getenv()

import os
print("DEBUG SPOONACULAR KEY:", os.getenv("SPOONACULAR_API_KEY"))
print("DEBUG GEMINI KEY:", os.getenv("GEMINI_API_KEY"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import recipes

app = FastAPI(title="SmartMeal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://cook-peach-ten.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recipes.router)


@app.get("/")
def read_root():
    return {"status": "SmartMeal backend is running"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}