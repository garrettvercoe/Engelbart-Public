import os
import time
from celery import Celery
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
import json
import sqlite3
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from unidecode import unidecode
import pandas as pd
from scripts.reducer import reducer
import random
analyzer = SentimentIntensityAnalyzer()

# consumer key, consumer secret, access token, access secret.
ckey = "xxxxxxxxxxxxxxxxxx"
csecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
atoken = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
asecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"


us = [-125.33203125, 32.54681317351514,  -
      67.67578124999999, 48.574789910928864]
conn = sqlite3.connect('twitter.db')
c = conn.cursor()


def create_table():
    try:
        c.execute(
            "CREATE TABLE IF NOT EXISTS sentiment(unix REAL, tweet TEXT, sentiment REAL)")
        c.execute("CREATE INDEX fast_unix ON sentiment(unix)")
        c.execute("CREATE INDEX fast_tweet ON sentiment(tweet)")
        c.execute("CREATE INDEX fast_sentiment ON sentiment(sentiment)")
        conn.commit()
    except Exception as e:
        print(str(e))


create_table()


class listener(StreamListener):

    def on_data(self, data):
        try:
            data = json.loads(data)
            tweet = unidecode(data['text'])
            time_ms = data['timestamp_ms']
            vs = analyzer.polarity_scores(tweet)
            sentiment = vs['compound']
            c.execute("INSERT INTO sentiment (unix, tweet, sentiment) VALUES (?, ?, ?)",
                      (time_ms, tweet, sentiment))
            conn.commit()
            # print(tweet)

        except KeyError as e:
            print(str(e))
        return(True)

    def on_error(self, status):
        print(status)


CELERY_BROKER_URL = os.environ.get(
    'CELERY_BROKER_URL', 'redis://localhost:6379'),
CELERY_RESULT_BACKEND = os.environ.get(
    'CELERY_RESULT_BACKEND', 'redis://localhost:6379')

celery = Celery('tasks', broker=CELERY_BROKER_URL,
                backend=CELERY_RESULT_BACKEND)


@celery.task(name='tasks.add')
def add(x: int, y: int) -> int:
    time.sleep(5)
    return x + y


@celery.task(name='tasks.stream')
def runStream():
    while True:
        try:
            auth = OAuthHandler(ckey, csecret)
            auth.set_access_token(atoken, asecret)
            twitterStream = Stream(auth, listener())
            twitterStream.filter(
                track=['a', 'e', 'i', 'o', 'u'])
        except Exception as e:
            print(str(e))
            time.sleep(5)


@celery.task(name='tasks.getData')
def data():
    time.sleep(5*60)
    path = 'twitter.db'
    db = sqlite3.connect(path)
    allDf = pd.read_sql_query(
        "SELECT LOWER(tweet),sentiment FROM sentiment WHERE unix > strftime('%s', 'now')*1000 - 5*60*1000", db)
    df = pd.read_sql_query(
        "SELECT LOWER(tweet),sentiment FROM sentiment WHERE LOWER(tweet) LIKE '%#%' AND unix > strftime('%s', 'now')*1000 - 5*60*1000", db)
    df = df.rename(columns={'LOWER(tweet)': 'tweet'})
    allDf = allDf.rename(columns={'LOWER(tweet)': 'tweet'})
    return reducer(df, allDf)


@celery.task(bind=True)
def long_task(self):
    verb = ['Starting up', 'Booting', 'Repairing',
            'Loading', 'Checking', 'Learning about', ]
    adjective = ['master', 'radiant', 'silent', 'harmonic', 'fast']
    noun = ['latent space', 'sentiment reshaper',
            'tweet storms', 'async', 'stream', 'walking', 'thinking']
    message = ''
    total = 5*66
    for i in range(total):
        if not message or random.random() < 0.25:
            message = '{0} {1} {2}...'.format(random.choice(verb),
                                              random.choice(adjective),
                                              random.choice(noun))
        self.update_state(state='PROGRESS',
                          meta={'current': i, 'total': total,
                                'status': message})
        time.sleep(1)
    return {'current': 100, 'total': 100, 'status': 'Task completed!',
            'result': 42}
