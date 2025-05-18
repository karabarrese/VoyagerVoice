#!/usr/bin/env python3
import argparse
import requests
import base64
import sys

def main():
    parser = argparse.ArgumentParser(
        description="Send a query to /api/process, print the text, and save the audio MP3."
    )
    parser.add_argument(
        "query",
        help="The topic to send to the API (e.g. 'Washington Monument')"
    )
    parser.add_argument(
        "-u", "--url",
        default="http://localhost:5000/api/process",
        help="The full URL of the Flask endpoint"
    )
    parser.add_argument(
        "-o", "--output",
        default="output.mp3",
        help="Filename to save the returned audio (MP3)"
    )
    args = parser.parse_args()

    try:
        resp = requests.post(
            args.url,
            json={"query": args.query},
            headers={"Content-Type": "application/json"}
        )
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Request failed: {e}", file=sys.stderr)
        sys.exit(1)

    data = resp.json()
    if "error" in data:
        print(f"[API ERROR] {data['error']}", file=sys.stderr)
        sys.exit(1)

    # Print the returned text
    text = data.get("text")
    if text:
        print("\n--- Text Response ---\n")
        print(text)
        print("\n---------------------\n")
    else:
        print("[WARNING] No 'text' field in response.", file=sys.stderr)

    # Decode and save the audio
    audio_b64 = data.get("audio_base64")
    if audio_b64:
        try:
            audio_bytes = base64.b64decode(audio_b64)
            with open(args.output, "wb") as f:
                f.write(audio_bytes)
            print(f"[OK] Audio saved as '{args.output}'")
        except Exception as e:
            print(f"[ERROR] Failed to decode or save audio: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        print("[WARNING] No 'audio_base64' field in response.", file=sys.stderr)

if __name__ == "__main__":
    main()