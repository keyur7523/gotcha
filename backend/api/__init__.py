from fastapi import APIRouter
from .routes import analysis, execute, history

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(analysis.router)
api_router.include_router(execute.router)
api_router.include_router(history.router)
