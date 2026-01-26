from fastapi import APIRouter, HTTPException, Header
from typing import Optional

from models.analysis import (
    AnalyzeRequest,
    AnalyzeResponse,
    AnalysisSession,
)
from services.session_store import session_store

router = APIRouter(prefix="/analyze", tags=["analysis"])


@router.post("", response_model=AnalyzeResponse)
async def create_analysis(
    request: AnalyzeRequest,
    x_custom_api_key: Optional[str] = Header(None),
) -> AnalyzeResponse:
    session = session_store.create_session(
        code=request.code,
        language=request.language,
        options=request.options,
        strictness=request.strictness,
        max_issues=request.max_issues,
        custom_api_key=x_custom_api_key,
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
