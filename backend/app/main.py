from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router

app = FastAPI(title="Lobby Lens API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://lobbylens-mk35.vercel.app",
        "https://lobbylens-mk35-npjb5uzhq-lobby-lens-team.vercel.app",
        "https://lobbylens-mk35-popfeba5m-lobby-lens-team.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)