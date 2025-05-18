# import asyncio
# from deepseek import get_full_response
# from wiki import content_get

# location, information = content_get("Arc de Triomphe")
# asyncio.run(get_full_response(location, information))

import asyncio
from deepseek import get_full_response
from wiki import content_get
import gradio as gr

def expose_app(user_input):
    print("🟡 User input received:", user_input)
    try:
        location, information = content_get(user_input)
        print("Location:", repr(location))
        print("Info:", repr(information[:300]))
        result = asyncio.run(get_full_response(location, information))
        print("Result:", repr(result))
        return result or "No response from AI model."
    except Exception as e:
        print("Error:", e)
        return f"Error: {str(e)}"

demo = gr.Interface(
    fn=expose_app,
    inputs=gr.Textbox(lines=1, placeholder="Enter a landmark..."),
    outputs="text",
    title="Voyager Voice",
    description="Generated landmark info!"
)

# Localhost only (for Expo on same Wi-Fi)
demo.launch(server_name="0.0.0.0", server_port=7861, share=False)
#OR
#demo.launch(share=True)
