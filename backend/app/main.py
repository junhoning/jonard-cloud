from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router

app = FastAPI(title="Jonard Cloud API", version="0.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)


@app.get("/api/meta")
def read_meta() -> dict[str, object]:
    return {
        "name": "Jonard Cloud",
        "stage": "scaffold",
        "features": [],
    }
