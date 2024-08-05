import requests
import hashlib
import pymongo
from datetime import datetime
import time
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)

# Define the Marvel API keys
public_key = '053981c51803300fca926fc6bc973764'
private_key = '9b1659c15c2d58941aa575a6f59e9eba2acb482f'

# Define the MongoDB connection
mongo_client = pymongo.MongoClient('localhost', 27017)
db = mongo_client['MarvelDb']
collection = db['cards']

# Generate the MD5 hash
def generate_hash(ts, private_key, public_key):
    to_hash = ts + private_key + public_key
    return hashlib.md5(to_hash.encode()).hexdigest()

# Fetch data from the Marvel API
def fetch_marvel_characters(offset, limit):
    ts = str(datetime.now().timestamp())
    hash_value = generate_hash(ts, private_key, public_key)
    url = f"http://gateway.marvel.com/v1/public/characters?offset={offset}&limit={limit}&ts={ts}&apikey={public_key}&hash={hash_value}"
    
    response = requests.get(url)  # Disable SSL verification
    if response.status_code == 200:
        return response.json()['data']['results']
    else:
        response.raise_for_status()

# Transform and load data into MongoDB
def load_data_to_mongo(data):
    for character in data:
        document = {
            "Name": character.get("name"),
            "Desc": character.get("description", False) if character.get("description") else False,
            "Img": character['thumbnail']['path'] + '.' + character['thumbnail']['extension'],
            "Details": {
                "series": {
                    "names": [item["name"] for item in character['series']['items']]
                },
                "events": {
                    "names": [item["name"] for item in character['events']['items']]
                },
                "comics": {
                    "names": [item["name"] for item in character['comics']['items']]
                }
            }
        }
        collection.insert_one(document)

# Main function to fetch and load data
def main():
    total_entries = 200
    batch_size = 10
    offset = 0
    max_retries = 5
    retry_delay = 2  # Initial retry delay in seconds

    while offset < total_entries:
        retries = 0
        while retries < max_retries:
            try:
                marvel_characters = fetch_marvel_characters(offset, batch_size)
                load_data_to_mongo(marvel_characters)
                offset += batch_size
                retry_delay = 2  # Reset retry delay after successful request
                break
            except Exception as e:
                retries += 1
                logging.error(f"Attempt {retries}: An error occurred: {e}. Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
                if retries == max_retries:
                    logging.error("Max retries exceeded. Skipping this batch.")
                    offset += batch_size  # Skip this batch and move to the next

        time.sleep(1)  # To avoid hitting the API rate limit

    logging.info("Data successfully inserted into MongoDB")

if __name__ == "__main__":
    main()