# Flask API backend that provides endpoints to fetch nearby locations and location details from the TripAdvisor API. 
from dotenv import load_dotenv
import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

# Obtain the API key
load_dotenv()
api_key = os.getenv("SECRET_KEY")

# Create a Flask application instance
app = Flask(__name__) 


#url = f"https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong=37.354107%2C%20-121.955238&key={api_key}&language=en"
# headers = {"accept": "application/json"}

# response = requests.get(url, headers=headers)
@app.route('/api/nearby_search', methods=['GET'])
def get_nearby_search():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    url = f"https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong={latitude}%2C%20{longitude}&key={api_key}&language=en"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    return jsonify(response.json()), response.status_code

@app.route('/api/location_details', methods=['GET'])
def get_location_details():
    location_id = request.args.get('location_id')
    url = f"https://api.content.tripadvisor.com/api/v1/location/{location_id}/details?key={api_key}&language=en"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    return jsonify(response.json()), response.status_code

@app.route('/api/find_search', methods=['GET'])
def get_find_search():
    search_query = request.args.get('searchQuery')
    # address = request.args.get('address')
    # if address:
    #     url = f"https://api.content.tripadvisor.com/api/v1/location/find_search?searchQuery={search_query}&address={address}&key={api_key}&language=en"
    # else:
    url = f"https://api.content.tripadvisor.com/api/v1/location/search?searchQuery={search_query}&key={api_key}&language=en"
    headers = {
        "accept": "application/json",
        "X-TripAdvisor-API-Key": api_key
        }
    response = requests.get(url, headers=headers)
    return jsonify(response.json()), response.status_code

@app.route('/api/location_photos', methods=['GET'])
def get_location_photos():
    location_id = request.args.get('location_id')
    limit = request.args.get('limit', default=1)
    url = f"https://api.content.tripadvisor.com/api/v1/location/{location_id}/photos?key={api_key}&language=en&limit={limit}"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    return jsonify(response.json()), response.status_code
if __name__ == "__main__":
    CORS(app)
    app.run(debug=True, host='0.0.0.0', port=3000)
