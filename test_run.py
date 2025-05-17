import asyncio
from deepseek import get_full_response
from wiki import content_get

location, information = content_get("Washington Monument")
asyncio.run(get_full_response(location, information))