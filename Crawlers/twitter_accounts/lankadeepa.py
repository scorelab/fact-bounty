import tweepy
import os
import time
import threading
from elasticsearch import Elasticsearch, helpers
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

consumer_key = os.getenv('consumer_key')
consumer_secret = os.getenv('consumer_secret')
access_key = os.getenv('access_key')
access_secret = os.getenv('access_secret')

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
es.indices.create(index='twitter_index', ignore=400)


def get_all_tweets(screen_name):
    # authorize twitter, initialize tweepy
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_key, access_secret)
    api = tweepy.API(auth)

    # initialize a list to hold all the tweepy Tweets
    alltweets = []

    # make initial request for most recent tweets (200 is the maximum allowed count)
    new_tweets = api.user_timeline(screen_name=screen_name, count=200)

    # save most recent tweets
    alltweets.extend(new_tweets)

    # save the id of the oldest tweet less one
    oldest = alltweets[-1].id - 1

    # keep grabbing tweets until there are no tweets left to grab
    while len(new_tweets) > 0:
        #print
        #"getting tweets before %s" % (oldest)

        # all subsiquent requests use the max_id param to prevent duplicates
        new_tweets = api.user_timeline(screen_name=screen_name, count=200, max_id=oldest)

        # save most recent tweets
        alltweets.extend(new_tweets)

        # update the id of the oldest tweet less one
        oldest = alltweets[-1].id - 1

        #print
        #"...%s tweets downloaded so far" % (len(alltweets))

    outtweets = [{'ID': tweet.id_str, 'Text': tweet.text, 'Date': tweet.created_at, 'author': tweet.user.screen_name} for tweet in alltweets]

    def save_es(outtweets, es):  # Peps8 convention
        data = [  # Please without s in data
            {
                "_index": "twitter_index",
                "_type": "LankadeepaNews",
                "_id": index,
                "_source": ID
            }
            for index, ID in enumerate(outtweets)
        ]
        helpers.bulk(es, data)

    save_es(outtweets, es)

    print('Run at:')
    print(datetime.now())
    print("\n")


if __name__ == '__main__':
    # pass in the username of the account you want to download
    get_all_tweets("LankadeepaNews")
    if __name__ == "__main__":
        time.sleep(60)
        while True:
            thr = threading.Thread(target=get_all_tweets("LankadeepaNews"))
            thr.start()
            time.sleep(3600)  # do work every one hour
