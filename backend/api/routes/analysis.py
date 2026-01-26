from fastapi import APIRouter, HTTPException

from models.analysis import (
    AnalyzeRequest,
    AnalyzeResponse,
    AnalysisSession,
)
from services.session_store import session_store

router = APIRouter(prefix="/analyze", tags=["analysis"])


@router.post("", response_model=AnalyzeResponse)
async def create_analysis(request: AnalyzeRequest) -> AnalyzeResponse:
    session = session_store.create_session(
        code=request.code,
        language=request.language,
        options=request.options,
    )

    session_store.update_session(session.id, status="running")

    return AnalyzeResponse(
        session_id=session.id,
        status="started",
    )


@router.get("/{session_id}", response_model=AnalysisSession)
async def get_analysis(session_id: str) -> AnalysisSession:
    session = session_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session
