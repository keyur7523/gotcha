import re
from typing import Optional

from services.gemini import GeminiClient

FIX_PROMPT = """Given this verified bug in {language} code:

Original code:
```{language}
{code}
```

Bug: {issue_title}
Line: {line_start}-{line_end}
Description: {issue_description}

Test that proves the bug:
```{language}
{test_code}
```

Test output:
{test_output}

Provide a minimal fix that:
1. Fixes ONLY this specific issue
2. Doesn't change other functionality
3. Follows {language} best practices

Output ONLY the corrected code snippet for the affected lines, no explanation."""


class FixGenerator:
    def __init__(self, custom_api_key: Optional[str] = None):
        self._client = GeminiClient(api_key=custom_api_key)

    async def generate_fix(
        self,
        code: str,
        language: str,
        issue_title: str,
        issue_description: str,
        line_start: int,
        line_end: int,
        test_code: str,
        test_output: str,
    ) -> str:
        prompt = FIX_PROMPT.format(
            language=language,
            code=code,
            issue_title=issue_title,
            issue_description=issue_description,
            line_start=line_start,
            line_end=line_end,
            test_code=test_code,
            test_output=test_output,
        )

        response = await self._client.generate(
            prompt=prompt,
            use_thinking=False,
            temperature=0.2,
        )

        return self._extract_code(response, language)

    def _extract_code(self, response: str, language: str) -> str:
        pattern = rf"```(?:{language})?\n(.*?)```"
        matches = re.findall(pattern, response, re.DOTALL | re.IGNORECASE)

        if matches:
            return matches[0].strip()

        return response.strip()


# Default generator for backward compatibility
fix_generator = FixGenerator()