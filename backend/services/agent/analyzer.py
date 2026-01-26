import json
from typing import Optional

from services.gemini import gemini_client

ANALYSIS_PROMPT = """You are an expert code reviewer. Analyze this {language} code for bugs, edge cases, and issues.

<code>
{code}
</code>

For each potential issue found, provide a JSON array with objects containing:
- "title": concise issue title
- "description": detailed explanation of why this is a problem
- "severity": one of "critical", "high", "medium", "low"
- "line_start": starting line number
- "line_end": ending line number
- "trigger_input": a specific input that would trigger this issue

Focus on:
- Logic errors and off-by-one mistakes
- Edge cases (empty inputs, null values, overflow)
- Type-related issues
- Division by zero, index out of bounds
- Resource leaks
- Security vulnerabilities

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
    async def analyze(self, code: str, language: str) -> list[dict]:
        prompt = ANALYSIS_PROMPT.format(code=code, language=language)

        response = await gemini_client.generate_json(
            prompt=prompt,
            use_thinking=True,
            temperature=0.3,
        )

        try:
            issues = json.loads(response)
            return issues if isinstance(issues, list) else []
        except json.JSONDecodeError:
            return []


analyzer = CodeAnalyzer()
