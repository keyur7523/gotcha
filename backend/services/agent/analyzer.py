import json
from typing import Optional

from services.gemini import GeminiClient

STRICTNESS_INSTRUCTIONS = {
    "relaxed": """Only report issues you are highly confident about. Focus on:
- Clear bugs that will definitely cause crashes or errors
- Critical security vulnerabilities
Ignore minor style issues and edge cases that are unlikely in practice.""",

    "normal": """Report issues with a balanced approach. Focus on:
- Logic errors and off-by-one mistakes
- Edge cases (empty inputs, null values, overflow)
- Type-related issues
- Division by zero, index out of bounds
- Resource leaks
- Security vulnerabilities""",

    "strict": """Be thorough and report all potential issues, including:
- All possible edge cases
- Style and maintainability issues
- Potential performance problems
- Any code that could be improved
- Missing error handling
- Documentation issues"""
}

ANALYSIS_PROMPT = """You are an expert code reviewer. Analyze this {language} code for bugs, edge cases, and issues.

<code>
{code}
</code>

{strictness_instruction}

For each potential issue found, provide a JSON array with objects containing:
- "title": concise issue title
- "description": detailed explanation of why this is a problem
- "severity": one of "critical", "high", "medium", "low"
- "line_start": starting line number
- "line_end": ending line number
- "trigger_input": a specific input that would trigger this issue

Return ONLY a JSON array. If no issues found, return an empty array [].

Example output:
[
  {{
    "title": "Division by zero",
    "description": "The function divides by len(lst) without checking if the list is empty",
    "severity": "critical",
    "line_start": 5,
    "line_end": 5,
    "trigger_input": "[]"
  }}
]"""


class CodeAnalyzer:
    def __init__(self, custom_api_key: Optional[str] = None):
        self._client = GeminiClient(api_key=custom_api_key)

    async def analyze(
        self,
        code: str,
        language: str,
        strictness: str = "normal",
    ) -> list[dict]:
        strictness_instruction = STRICTNESS_INSTRUCTIONS.get(strictness, STRICTNESS_INSTRUCTIONS["normal"])
        prompt = ANALYSIS_PROMPT.format(
            code=code,
            language=language,
            strictness_instruction=strictness_instruction,
        )

        response = await self._client.generate_json(
            prompt=prompt,
            temperature=0.3,
        )

        try:
            issues = json.loads(response)
            return issues if isinstance(issues, list) else []
        except json.JSONDecodeError:
            return []


# Default analyzer for backward compatibility
analyzer = CodeAnalyzer()
