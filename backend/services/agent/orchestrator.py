import uuid
from datetime import datetime
from typing import AsyncGenerator, Optional

from models.analysis import (
    AgentStep,
    AnalysisResult,
    Issue,
    IssueStatus,
    Severity,
    TestResult,
)
from services.session_store import session_store
from .analyzer import analyzer
from .test_generator import test_generator
from .fix_generator import fix_generator


class AgentOrchestrator:
    def __init__(self, executor=None):
        self._executor = executor

    async def run_analysis(
        self,
        session_id: str,
    ) -> AsyncGenerator[AgentStep, None]:
        session = session_store.get_session(session_id)
        if not session:
            return

        session_store.update_session(session_id, status="running")
        start_time = datetime.utcnow()
        steps: list[AgentStep] = []
        issues: list[Issue] = []
        step_number = 0

        # Step 1: Analyze code
        step_number += 1
        step = AgentStep(
            step_number=step_number,
            action="analyzing",
            description="Analyzing code for potential issues...",
            timestamp=datetime.utcnow(),
        )
        steps.append(step)
        yield step

        potential_issues = await analyzer.analyze(
            code=session.code,
            language=session.language.value,
        )

        # Step 2: Generate and execute tests for each issue
        for idx, potential in enumerate(potential_issues):
            step_number += 1
            step = AgentStep(
                step_number=step_number,
                action="generating_test",
                description=f"Generating test for: {potential.get('title', 'Issue')}",
                timestamp=datetime.utcnow(),
                data={"issue_index": idx},
            )
            steps.append(step)
            yield step

            test_code = await test_generator.generate(
                code=session.code,
                language=session.language.value,
                issue_title=potential.get("title", ""),
                issue_description=potential.get("description", ""),
                trigger_input=potential.get("trigger_input", ""),
            )

            # Step 3: Execute test
            step_number += 1
            step = AgentStep(
                step_number=step_number,
                action="executing",
                description=f"Executing test for: {potential.get('title', 'Issue')}",
                timestamp=datetime.utcnow(),
                data={"test_code": test_code},
            )
            steps.append(step)
            yield step

            test_result: Optional[TestResult] = None
            issue_status = IssueStatus.POTENTIAL

            if self._executor:
                exec_result = await self._executor.execute(
                    code=test_code,
                    language=session.language.value,
                )
                test_result = TestResult(
                    test_code=test_code,
                    passed=exec_result["exit_code"] == 0,
                    stdout=exec_result["stdout"],
                    stderr=exec_result["stderr"],
                    exit_code=exec_result["exit_code"],
                    duration_ms=exec_result["duration_ms"],
                )
                # If test failed (non-zero exit), bug is verified
                issue_status = (
                    IssueStatus.VERIFIED
                    if exec_result["exit_code"] != 0
                    else IssueStatus.POTENTIAL
                )
            else:
                # No executor - mark as potential with generated test
                test_result = TestResult(
                    test_code=test_code,
                    passed=True,
                    stdout="",
                    stderr="Executor not configured",
                    exit_code=-1,
                    duration_ms=0,
                )

            # Generate fix for verified issues
            suggested_fix = None
            if issue_status == IssueStatus.VERIFIED and test_result:
                step_number += 1
                step = AgentStep(
                    step_number=step_number,
                    action="refining",
                    description=f"Generating fix for: {potential.get('title', 'Issue')}",
                    timestamp=datetime.utcnow(),
                )
                steps.append(step)
                yield step

                suggested_fix = await fix_generator.generate_fix(
                    code=session.code,
                    language=session.language.value,
                    issue_title=potential.get("title", ""),
                    issue_description=potential.get("description", ""),
                    line_start=potential.get("line_start", 1),
                    line_end=potential.get("line_end", 1),
                    test_code=test_result.test_code,
                    test_output=test_result.stderr or test_result.stdout,
                )

            issue = Issue(
                id=str(uuid.uuid4()),
                title=potential.get("title", "Unknown Issue"),
                description=potential.get("description", ""),
                severity=Severity(potential.get("severity", "medium")),
                status=issue_status,
                line_start=potential.get("line_start", 1),
                line_end=potential.get("line_end", 1),
                test_result=test_result,
                suggested_fix=suggested_fix,
                reasoning=potential.get("description", ""),
            )
            issues.append(issue)

        # Step: Complete
        step_number += 1
        end_time = datetime.utcnow()
        duration_ms = int((end_time - start_time).total_seconds() * 1000)

        verified_count = sum(1 for i in issues if i.status == IssueStatus.VERIFIED)
        potential_count = sum(1 for i in issues if i.status == IssueStatus.POTENTIAL)

        result = AnalysisResult(
            issues=issues,
            summary=f"Found {verified_count} verified and {potential_count} potential issues",
            code_quality_score=self._calculate_score(issues),
            steps=steps,
            total_duration_ms=duration_ms,
        )

        session_store.update_session(
            session_id,
            status="completed",
            result=result,
            completed_at=end_time,
        )

        step = AgentStep(
            step_number=step_number,
            action="complete",
            description=f"Analysis complete. {result.summary}",
            timestamp=end_time,
            data={"total_issues": len(issues)},
        )
        steps.append(step)
        yield step

    def _calculate_score(self, issues: list[Issue]) -> int:
        if not issues:
            return 100

        penalty = 0
        for issue in issues:
            if issue.status == IssueStatus.VERIFIED:
                if issue.severity == Severity.CRITICAL:
                    penalty += 30
                elif issue.severity == Severity.HIGH:
                    penalty += 20
                elif issue.severity == Severity.MEDIUM:
                    penalty += 10
                else:
                    penalty += 5
            else:
                # Potential issues have half penalty
                if issue.severity == Severity.CRITICAL:
                    penalty += 15
                elif issue.severity == Severity.HIGH:
                    penalty += 10
                elif issue.severity == Severity.MEDIUM:
                    penalty += 5
                else:
                    penalty += 2

        return max(0, 100 - penalty)
