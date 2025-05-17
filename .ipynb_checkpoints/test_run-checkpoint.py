import asyncio
from deepseek import get_full_response
from wiki import content_get

location, information = content_get("Arc de Triomphe")
asyncio.run(get_full_response(location, information))