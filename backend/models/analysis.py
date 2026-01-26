from pydantic import BaseModel
from typing import Literal, Optional
from datetime import datetime
from enum import Enum


class Language(str, Enum):
    PYTHON = "python"
    JAVASCRIPT = "javascript"


class Severity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class IssueStatus(str, Enum):
    VERIFIED = "verified"
    POTENTIAL = "potential"
    SUGGESTION = "suggestion"


class AnalysisOptions(BaseModel):
    max_iterations: int = 3
    include_style_checks: bool = True
    generate_fixes: bool = True


class TestResult(BaseModel):
    test_code: str
    passed: bool
    stdout: str
    stderr: str
    exit_code: int
    duration_ms: int
    error_line: Optional[int] = None


class Issue(BaseModel):
    id: str
    title: str
    description: str
    severity: Severity
    status: IssueStatus
    line_start: int
    line_end: int
    test_result: Optional[TestResult] = None
    suggested_fix: Optional[str] = None
    reasoning: str


class AgentStep(BaseModel):
    step_number: int
    action: Literal["analyzing", "generating_test", "executing", "refining", "complete"]
    description: str
    timestamp: datetime
    data: Optional[dict] = None


class AnalysisResult(BaseModel):
    issues: list[Issue]
    summary: str
    code_quality_score: int
    steps: list[AgentStep]
    total_duration_ms: int


class AnalysisSession(BaseModel):
    id: str
    code: str
    language: Language
    status: Literal["pending", "running", "completed", "error"]
    result: Optional[AnalysisResult] = None
    created_at: datetime
    completed_at: Optional[datetime] = None


class AnalyzeRequest(BaseModel):
    code: str
    language: Language
    options: Optional[AnalysisOptions] = None


class AnalyzeResponse(BaseModel):
    session_id: str
    status: Literal["started"]
