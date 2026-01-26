from google import genai
from google.genai import types

from core.config import settings


class GeminiClient:
    def __init__(self):
        self._client = genai.Client(api_key=settings.gemini_api_key)
        self._model = "gemini-2.0-flash"
        self._thinking_model = "gemini-2.0-flash-thinking-exp-01-21"

    async def generate(
        self,
        prompt: str,
        use_thinking: bool = False,
        temperature: float = 0.7,
    ) -> str:
        model = self._thinking_model if use_thinking else self._model

        response = await self._client.aio.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=temperature,
            ),
        )

        return response.text

    async def generate_json(
        self,
        prompt: str,
        use_thinking: bool = False,
        temperature: float = 0.3,
    ) -> str:
        model = self._thinking_model if use_thinking else self._model

        response = await self._client.aio.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=temperature,
                response_mime_type="application/json",
            ),
        )

        return response.text


gemini_client = GeminiClient()
