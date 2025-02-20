from connectDb import get_db

db = get_db()

collection = db['ratedusers']

aggregation = [
    {
        "$project": {
            "handle": 1,
            "rating_range": {
                "$cond": {
                    "if": {"$gt": [{"$mod": ["$rating", 100]}, 50]},
                    "then": {"$multiply": [{"$add": [{"$toInt": {"$divide": ["$rating", 100]}}, 1]}, 100]},
                    "else": {"$add": [{"$multiply": [{"$toInt": {"$divide": ["$rating", 100]}}, 100]}, 50]},
                }
            }
        }
    },
    {
        "$group": {
            "_id": "$rating_range",
            "handles": {"$addToSet": "$handle"}
        }
    },
    {
        "$sort": {
            "_id": -1
        }
    }
]

results = collection.aggregate(aggregation)

for result in results:
    print(result)

