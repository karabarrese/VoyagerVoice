from google.cloud import texttospeech
from dotenv import load_dotenv
import os

load_dotenv('env.txt')
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]  = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
def synthesize_text(text="Hello World", output_file="output.mp3"):
    
    client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        name="en-US-Chirp3-HD-Achernar"
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )
    with open(output_file, "wb") as out:
        out.write(response.audio_content)
