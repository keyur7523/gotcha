from fastapi import APIRouter
from pydantic import BaseModel

from services.executor import executor

router = APIRouter(prefix="/execute", tags=["execute"])


class ExecuteRequest(BaseModel):
    code: str
    language: str


class ExecuteResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
    duration_ms: int


@router.post("", response_model=ExecuteResponse)
async def execute_code(request: ExecuteRequest) -> ExecuteResponse:
    result = await executor.execute(
        code=request.code,
        language=request.language,
    )

    return ExecuteResponse(
        stdout=result["stdout"],
        stderr=result["stderr"],
        exit_code=result["exit_code"],
        duration_ms=result["duration_ms"],
    )
