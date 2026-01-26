import re

from services.gemini import gemini_client

TEST_GEN_PROMPT = """Generate a minimal test case to verify this potential bug in {language}:

Issue: {issue_title}
Description: {issue_description}
Trigger input: {trigger_input}

Original code:
```{language}
{code}
```

Create a single test that:
1. Imports or includes the function from the code
2. Calls it with the problematic input
3. Will FAIL or raise an exception if the bug exists

For Python: Write a simple script that will raise an exception or assertion error if the bug exists.
For JavaScript: Write code that throws an error if the bug exists.

IMPORTANT: Include the original code at the top of your test, then add the test below it.

Output ONLY the complete runnable code, no markdown, no explanation."""


class TestGenerator:
    async def generate(
        self,
        code: str,
        language: str,
        issue_title: str,
        issue_description: str,
        trigger_input: str,
    ) -> str:
        prompt = TEST_GEN_PROMPT.format(
            language=language,
            issue_title=issue_title,
            issue_description=issue_description,
            trigger_input=trigger_input,
            code=code,
        )

        response = await gemini_client.generate(
            prompt=prompt,
            use_thinking=False,
            temperature=0.2,
        )

        return self._extract_code(response, language)

    def _extract_code(self, response: str, language: str) -> str:
        # Try to extract code from markdown blocks
        pattern = rf"```(?:{language})?\n(.*?)```"
        matches = re.findall(pattern, response, re.DOTALL | re.IGNORECASE)

        if matches:
            return matches[0].strip()

        # If no markdown blocks, return cleaned response
        return response.strip()


test_generator = TestGenerator()
