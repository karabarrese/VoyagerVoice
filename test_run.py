import asyncio
from deepseek import get_full_response
from tts import synthesize_text
from wiki import content_get

location, information = content_get("Washington Monument")
text = asyncio.run(get_full_response(location, information))
synthesize_text(text)