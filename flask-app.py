import os
import uuid
import asyncio
import tempfile
import base64

from flask import Flask, request, jsonify
from flask_cors import CORS

from wiki import content_get
from deepseek import get_full_response
from tts import synthesize_text

app = Flask(__name__)
CORS(app)

@app.route('/api/process', methods=['POST'])
def process_query():
    data = request.get_json(force=True)
    query = data.get('query')
    if not query:
        return jsonify({"error": "Missing 'query' in JSON payload."}), 400

    try:
        title, summary = content_get(query, data_type="summary")
    except Exception as e:
        return jsonify({"error": f"Wikipedia lookup failed: {e}"}), 500

    try:
        text = asyncio.run(get_full_response(title, summary))
    except Exception as e:
        return jsonify({"error": f"Deepseek processing failed: {e}"}), 500

    tmp_dir  = tempfile.gettempdir()
    fname    = f"{uuid.uuid4().hex}.mp3"
    out_path = os.path.join(tmp_dir, fname)

    try:
        synthesize_text(text=text, output_file=out_path)
        if not os.path.exists(out_path):
            raise RuntimeError("TTS produced no file.")
    except Exception as e:
        return jsonify({"error": f"TTS synthesis failed: {e}"}), 500

    with open(out_path, "rb") as f:
        audio_bytes = f.read()
    audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")

    return jsonify({
        "text": text,
        "audio_base64": audio_b64
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
