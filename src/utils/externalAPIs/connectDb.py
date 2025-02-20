from pymongo import MongoClient
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('../../.env');

def get_database_connection() -> Optional[MongoClient]:
    """
    Establishes connection to MongoDB using environment variables.
    Returns MongoDB client if successful, None if connection fails.
    """
    try:
        # Get MongoDB connection string from environment variables
        MONGO_URI = os.getenv('MONGO_URI')
        
        # Create a connection using MongoClient
        client = MongoClient(MONGO_URI)
        
        # Test the connection
        client.admin.command('ping')
        print("Successfully connected to MongoDB!")
        
        return client
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return None

def get_database(database_name: str):
    """
    Returns a specific database instance.
    """
    client = get_database_connection()
    if client:
        return client[database_name]
    return None

def get_db():
    MONGO_DATABASE = os.getenv('MONGO_DATABASE')
    # Get a database instance
    db = get_database(MONGO_DATABASE)

    if db is not None:
        return db
    else:
        return None

