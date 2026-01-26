from fastapi import APIRouter, HTTPException

from models.analysis import AnalysisSession
from services.session_store import session_store

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=list[AnalysisSession])
async def list_sessions() -> list[AnalysisSession]:
    sessions = session_store.list_sessions()
    # Return sorted by created_at descending (newest first)
    return sorted(sessions, key=lambda s: s.created_at, reverse=True)


@router.get("/{session_id}", response_model=AnalysisSession)
async def get_session(session_id: str) -> AnalysisSession:
    session = session_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session
