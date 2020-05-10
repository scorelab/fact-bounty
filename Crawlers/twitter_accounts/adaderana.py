import get__tweets
import os
import time
import threading

if __name__ == '__main__':
    # pass in the username of the account  want to download
    get_all_tweets("adaderana")
    if __name__ == "__main__":
        time.sleep(60)
        while True:
            thr = threading.Thread(target=get__tweets.get_all_tweets("adaderana"))
            thr.start()
            time.sleep(3600)  # do work every one hour
