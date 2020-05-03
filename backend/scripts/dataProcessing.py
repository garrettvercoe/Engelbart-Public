import sqlite3
import pandas as pd
import re
import operator
from collections import OrderedDict
from langdetect import detect
from langdetect import detect_langs
import json
from scripts.engelbartBrain import createSummary
from bs4 import BeautifulSoup
import sys
sys.setrecursionlimit(1500)


def countTweets(hashDf):
    HASHTAG_REGEX = r'(#|＃)([a-z0-9_\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253-\u0254\u0256-\u0257\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff\u0500-\u0527\u2de0-\u2dff\ua640-\ua69f\u0591-\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05d0-\u05ea\u05f0-\u05f4\ufb12-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4f\u0610-\u061a\u0620-\u065f\u066e-\u06d3\u06d5-\u06dc\u06de-\u06e8\u06ea-\u06ef\u06fa-\u06fc\u0750-\u077f\u08a2-\u08ac\u08e4-\u08fe\ufb50-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\u200c-\u200c\u0e01-\u0e3a\u0e40-\u0e4e\u1100-\u11ff\u3130-\u3185\ua960-\ua97f\uac00-\ud7af\ud7b0-\ud7ff\uffa1-\uffdc\u30a1-\u30fa\u30fc-\u30fe\uff66-\uff9f\uff10-\uff19\uff21-\uff3a\uff41-\uff5a\u3041-\u3096\u3099-\u309e\u3400-\u4dbf\u4e00-\u9fff\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2f800-\u2fa1f]*[a-z_\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253-\u0254\u0256-\u0257\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff\u0500-\u0527\u2de0-\u2dff\ua640-\ua69f\u0591-\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05d0-\u05ea\u05f0-\u05f4\ufb12-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4f\u0610-\u061a\u0620-\u065f\u066e-\u06d3\u06d5-\u06dc\u06de-\u06e8\u06ea-\u06ef\u06fa-\u06fc\u0750-\u077f\u08a2-\u08ac\u08e4-\u08fe\ufb50-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\u200c-\u200c\u0e01-\u0e3a\u0e40-\u0e4e\u1100-\u11ff\u3130-\u3185\ua960-\ua97f\uac00-\ud7af\ud7b0-\ud7ff\uffa1-\uffdc\u30a1-\u30fa\u30fc-\u30fe\uff66-\uff9f\uff10-\uff19\uff21-\uff3a\uff41-\uff5a\u3041-\u3096\u3099-\u309e\u3400-\u4dbf\u4e00-\u9fff\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2f800-\u2fa1f][a-z0-9_\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253-\u0254\u0256-\u0257\u0300-\u036f\u1e00-\u1eff\u0400-\u04ff\u0500-\u0527\u2de0-\u2dff\ua640-\ua69f\u0591-\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05d0-\u05ea\u05f0-\u05f4\ufb12-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4f\u0610-\u061a\u0620-\u065f\u066e-\u06d3\u06d5-\u06dc\u06de-\u06e8\u06ea-\u06ef\u06fa-\u06fc\u0750-\u077f\u08a2-\u08ac\u08e4-\u08fe\ufb50-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\u200c-\u200c\u0e01-\u0e3a\u0e40-\u0e4e\u1100-\u11ff\u3130-\u3185\ua960-\ua97f\uac00-\ud7af\ud7b0-\ud7ff\uffa1-\uffdc\u30a1-\u30fa\u30fc-\u30fe\uff66-\uff9f\uff10-\uff19\uff21-\uff3a\uff41-\uff5a\u3041-\u3096\u3099-\u309e\u3400-\u4dbf\u4e00-\u9fff\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2f800-\u2fa1f])'
    d = {}
    for line in hashDf.tweet:
        m = re.findall(HASHTAG_REGEX, line)
        for word in m:
            try:
                d[word[1].lower()] += 1
            except KeyError:
                d[word[1].lower()] = 1
    tupleList = [(v, k) for k, v in d.items()]
    tuple_df = pd.DataFrame.from_records(tupleList)
    tuple_df = tuple_df.sort_values(by=0, ascending=False)
    return list(tuple_df[[0, 1]].to_records(index=False))


def sentimentData(df):
    bins = [-1, -.75, -.5, -.25, 0, .25, .5, .75, 1]
    labels = [0, 1, 2, 3, 4, 5, 6, 7]
    df['binned'] = pd.cut(df['sentiment'], bins, labels=labels)
    buckets = df['binned'].value_counts(normalize=True)
    jsonBuckets = []
    for i in range(len(buckets)):
        jsonBuckets.append(buckets[i])
    return jsonBuckets


def cleaner(hashtag_df):
    c_df = hashtag_df.reset_index(drop=True)
    for i in range(len(c_df)):
        init = str(c_df.tweet[i])
        souped = BeautifulSoup(init, 'lxml')
        specChar = souped.get_text().replace('\n', ' ')
        c = re.sub(r'rt [a-zA-z0-9_]+:', '', specChar)
        c = re.sub(r'@[A-Za-z0-9_]+', '', c)
        c = re.sub(r'rt : ', '', c)
        c_df.tweet[i] = re.sub('https?://[A-Za-z0-9./]+', '', c)
    return c_df


def englishFilter(df, threshold=.1):
    df["en"] = 0
    for i in range(len(df["tweet"])):
        try:
            if detect(df["tweet"][i]) == "en":
                df["en"][i] = 1
        except:
            pass
    true_perc = df['en'].sum() / df.size
    if true_perc > threshold:
        return df[df["en"] == 1]
    return None


def formatter(score, word, sentiment, summary, position):
    return {"Tag": word, "Sentiment": sentiment, "Popularity": score, "Summary": summary, "Position": position}


def getTagData(hashtag, df, position):
    score = hashtag[0]
    word = hashtag[1]
    if score >= 10:
        hashtag_database = df[df['tweet'].str.contains("#" + word)]
        c_hash_db = cleaner(hashtag_database)
        fin_df = englishFilter(c_hash_db)
        if fin_df is not None:
            if len(fin_df) >= 10:
                sentiment = sentimentData(fin_df)
                summary = createSummary(fin_df)
                return formatter(len(fin_df), word, sentiment, summary, position)