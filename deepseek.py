import aiohttp
import asyncio
import json

from dotenv import load_dotenv
import os

load_dotenv('env.txt')

api_token = os.getenv('DEEPSEEK_KEY')

async def chute_stream_and_collect(location, information):
    print(information)
    holder=[
        {"role":"assistant", "content": f"{information}"},
        {"role":"system", "content": f"You are a friendly podcaster giving a verbal tour of potential sightseeing areas. Summarize your information about {location} into easily digestible content for a user. Do not acknowledge your role as a chatbot. You cannot interact with the user beyond generating content."} 
    ]
    
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "tngtech/DeepSeek-R1T-Chimera",
        "messages": holder,
        "stream": True,
        "temperature": 0.7
    }

    full_text = ""  # Single string buffer

    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://llm.chutes.ai/v1/chat/completions",
            headers=headers,
            json=body
        ) as response:
            async for line in response.content:
                line = line.decode("utf-8").strip()
                if line.startswith("data: "):
                    data = line[6:]
                    if data == "[DONE]":
                        break
                    try:
                        chunk = json.loads(data)
                        delta = chunk['choices'][0]['delta']
                        content = delta.get('content') or ''
                        full_text += content
                        yield content
                    except Exception as e:
                        print(f"Error parsing chunk: {e}")
                        
async def get_full_response(location, information=""):
    text = ""
    async for chunk in chute_stream_and_collect(location, information):
        text += chunk
        print(chunk, end="", flush=True)
    return text