from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import api_router
from api.routes import websocket
from core.config import settings

app = FastAPI(
    title=settings.app_name,
    description="Code review agent that verifies bugs with generated tests",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.include_router(websocket.router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "app": settings.app_name}
