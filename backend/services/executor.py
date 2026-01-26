import subprocess
import tempfile
import os
import time
from typing import TypedDict


class ExecutionResult(TypedDict):
    stdout: str
    stderr: str
    exit_code: int
    duration_ms: int


class LocalExecutor:
    """Local code executor with basic sandboxing via subprocess timeout."""

    def __init__(self, timeout_seconds: int = 10):
        self.timeout = timeout_seconds

    async def execute(self, code: str, language: str) -> ExecutionResult:
        if language == "python":
            return await self._execute_python(code)
        elif language == "javascript":
            return await self._execute_javascript(code)
        else:
            return ExecutionResult(
                stdout="",
                stderr=f"Unsupported language: {language}",
                exit_code=1,
                duration_ms=0,
            )

    async def _execute_python(self, code: str) -> ExecutionResult:
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".py", delete=False
        ) as f:
            f.write(code)
            f.flush()
            temp_path = f.name

        try:
            start = time.perf_counter()
            result = subprocess.run(
                ["python3", temp_path],
                capture_output=True,
                text=True,
                timeout=self.timeout,
                cwd=tempfile.gettempdir(),
            )
            duration_ms = int((time.perf_counter() - start) * 1000)

            return ExecutionResult(
                stdout=result.stdout[:10000],
                stderr=result.stderr[:10000],
                exit_code=result.returncode,
                duration_ms=duration_ms,
            )
        except subprocess.TimeoutExpired:
            return ExecutionResult(
                stdout="",
                stderr=f"Execution timed out after {self.timeout}s",
                exit_code=124,
                duration_ms=self.timeout * 1000,
            )
        except Exception as e:
            return ExecutionResult(
                stdout="",
                stderr=str(e),
                exit_code=1,
                duration_ms=0,
            )
        finally:
            os.unlink(temp_path)

    async def _execute_javascript(self, code: str) -> ExecutionResult:
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".js", delete=False
        ) as f:
            f.write(code)
            f.flush()
            temp_path = f.name

        try:
            start = time.perf_counter()
            result = subprocess.run(
                ["node", temp_path],
                capture_output=True,
                text=True,
                timeout=self.timeout,
                cwd=tempfile.gettempdir(),
            )
            duration_ms = int((time.perf_counter() - start) * 1000)

            return ExecutionResult(
                stdout=result.stdout[:10000],
                stderr=result.stderr[:10000],
                exit_code=result.returncode,
                duration_ms=duration_ms,
            )
        except subprocess.TimeoutExpired:
            return ExecutionResult(
                stdout="",
                stderr=f"Execution timed out after {self.timeout}s",
                exit_code=124,
                duration_ms=self.timeout * 1000,
            )
        except FileNotFoundError:
            return ExecutionResult(
                stdout="",
                stderr="Node.js not found. Install Node.js to execute JavaScript.",
                exit_code=1,
                duration_ms=0,
            )
        except Exception as e:
            return ExecutionResult(
                stdout="",
                stderr=str(e),
                exit_code=1,
                duration_ms=0,
            )
        finally:
            os.unlink(temp_path)


executor = LocalExecutor()
