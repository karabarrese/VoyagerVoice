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
    #http://localhost:3000/api/nearby_search?latitude=37.354107&longitude=-121.955238

@app.route('/api/location_details', methods=['GET'])
def get_location_details():
    location_id = request.args.get('location_id')
    url = f"https://api.content.tripadvisor.com/api/v1/location/{location_id}/details?key={api_key}&language=en"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    return jsonify(response.json()), response.status_code
    #http://localhost:3000/api/location_details?location_id=123156

@app.route('/api/find_search', methods=['GET'])
def get_find_search():
    search_query = request.args.get('searchQuery')
    address = request.args.get('address')
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    # if address and latitude and longitude:
    #     url = f"https://api.content.tripadvisor.com/api/v1/location/search?searchQuery={search_query}&address={address}&latLong={latitude}%2C%20{longitude}&key={api_key}&language=en"
    if address: 
        url = f"https://api.content.tripadvisor.com/api/v1/location/search?searchQuery={search_query}&address={address}&key={api_key}&language=en"
    else:
        url = f"https://api.content.tripadvisor.com/api/v1/location/search?searchQuery={search_query}&key={api_key}&language=en"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    return jsonify(response.json()), response.status_code
    #http://localhost:3000/api/find_search?searchQuery=UCLA
    #http://localhost:3000/api/find_search?searchQuery=UCLA&address=850%20Willow%20Creek%20Road%2C%20Lake%20Arrowhead%2C%20CA%2092352

@app.route('/api/location_photos', methods=['GET'])
def get_location_photos():
    location_id = request.args.get('location_id')
    limit = request.args.get('limit', default=1)
    url = f"https://api.content.tripadvisor.com/api/v1/location/{location_id}/photos?key={api_key}&language=en&limit={limit}"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    return jsonify(response.json()), response.status_code
    #http://localhost:3000/api/location_photos?location_id=80039

@app.route('/api/nearby_search_photo', methods=['GET'])
def nearby_search_photo():
    # get location id from lat/long
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    url = f"https://api.content.tripadvisor.com/api/v1/location/nearby_search?latLong={latitude}%2C%20{longitude}&key={api_key}&language=en"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    # location_id = response.json()["data"][0]["location_id"]
    data = response.json().get("data", [])
    location_ids = [item.get("location_id") for item in data if "location_id" in item]
    # return jsonify(location_ids)

    # get photo from location id
    locationImage = ""
    location_id_index = 0
    while(locationImage == ""):
        limit = request.args.get('limit', default=1)
        url = f"https://api.content.tripadvisor.com/api/v1/location/{location_ids[location_id_index]}/photos?key={api_key}&language=en&limit={limit}"
        headers = {"accept": "application/json"}
        response = requests.get(url, headers=headers)
        if(response.json()["data"]):
            locationImage = response.json()["data"][0]["images"]["medium"]["url"]
            return jsonify(locationImage)
        location_id_index+=1
        
    return jsonify("")
    #http://localhost:3000/api/nearby_search_photo?latitude=37.349495730726005&longitude=-121.94103315482995

@app.route('/api/find_search_photo', methods=['GET'])
def find_search_photo():
    # get location id from query
    search_query = request.args.get('searchQuery')
    url = f"https://api.content.tripadvisor.com/api/v1/location/search?searchQuery={search_query}&key={api_key}&language=en"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    # return jsonify(response.json()), response.status_code

    data = response.json().get("data", [])
    location_ids = [item.get("location_id") for item in data if "location_id" in item]

    # get photo from location id
    locationImage = ""
    location_id_index = 0
    while(locationImage == ""):
        limit = request.args.get('limit', default=1)
        url = f"https://api.content.tripadvisor.com/api/v1/location/{location_ids[location_id_index]}/photos?key={api_key}&language=en&limit={limit}"
        headers = {"accept": "application/json"}
        response = requests.get(url, headers=headers)
        if(response.json()["data"]):
            locationImage = response.json()["data"][0]["images"]["medium"]["url"]
            return jsonify(locationImage)
        location_id_index+=1
        
    return jsonify("")
    #http://localhost:3000/api/find_search_photo?searchQuery=UCLA

if __name__ == "__main__":
    CORS(app)
    app.run(debug=True, host='0.0.0.0', port=3000)
