from datetime import datetime
from typing import Optional, Any
import uuid

from models.analysis import AnalysisSession, Language, AnalysisOptions, Strictness


class SessionStore:
    def __init__(self):
        self._sessions: dict[str, AnalysisSession] = {}
        self._metadata: dict[str, dict[str, Any]] = {}

    def create_session(
        self,
        code: str,
        language: Language,
        options: Optional[AnalysisOptions] = None,
        strictness: Strictness = Strictness.NORMAL,
        max_issues: int = 10,
        custom_api_key: Optional[str] = None,
    ) -> AnalysisSession:
        session_id = str(uuid.uuid4())
        session = AnalysisSession(
            id=session_id,
            code=code,
            language=language,
            status="pending",
            created_at=datetime.utcnow(),
        )
        self._sessions[session_id] = session
        self._metadata[session_id] = {
            "options": options,
            "strictness": strictness,
            "max_issues": max_issues,
            "custom_api_key": custom_api_key,
        }
        return session

    def get_metadata(self, session_id: str) -> dict[str, Any]:
        return self._metadata.get(session_id, {})

    def get_session(self, session_id: str) -> Optional[AnalysisSession]:
        return self._sessions.get(session_id)

    def update_session(self, session_id: str, **kwargs) -> Optional[AnalysisSession]:
        session = self._sessions.get(session_id)
        if session:
            updated_data = session.model_dump()
            updated_data.update(kwargs)
            self._sessions[session_id] = AnalysisSession(**updated_data)
            return self._sessions[session_id]
        return None

    def list_sessions(self) -> list[AnalysisSession]:
        return list(self._sessions.values())


session_store = SessionStore()
