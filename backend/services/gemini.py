from typing import Optional

from google import genai
from google.genai import types

from core.config import settings


class GeminiClient:
    def __init__(self, api_key: Optional[str] = None):
        # Use custom API key if provided, otherwise fall back to settings
        key = api_key or settings.gemini_api_key
        self._client = genai.Client(api_key=key)
        self._model = "gemini-2.0-flash"

    async def generate(
        self,
        prompt: str,
        use_thinking: bool = False,
        temperature: float = 0.7,
    ) -> str:
        # use_thinking param kept for API compatibility but uses same model
        try:
            response = await self._client.aio.models.generate_content(
                model=self._model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=temperature,
                ),
            )
            return response.text or ""
        except Exception as e:
            print(f"Gemini API error: {e}")
            raise

    async def generate_json(
        self,
        prompt: str,
        use_thinking: bool = False,
        temperature: float = 0.3,
    ) -> str:
        # use_thinking param kept for API compatibility but uses same model
        try:
            response = await self._client.aio.models.generate_content(
                model=self._model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=temperature,
                    response_mime_type="application/json",
                ),
            )
            return response.text or "[]"
        except Exception as e:
            print(f"Gemini API error: {e}")
            raise


gemini_client = GeminiClient()
