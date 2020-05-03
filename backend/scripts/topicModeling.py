import fasttext
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import random


def createCorpus(data):
    corpus = ''
    for i in data.tweet:
        corpus += " " + i
    return corpus


def saveCorpus(corpus, name="corpus.txt"):
    with open(name, 'w') as filehandle:
        filehandle.write(corpus)
        filehandle.close()
    return name


def processCorpus(filename):
    model = fasttext.train_unsupervised(filename, model='skipgram')
    return model


def getCoords(rankings, data):
    model = processCorpus(saveCorpus(createCorpus(data)))
    modelLoc = []
    keywords = []
    for i in range(len(rankings)):
        modelLoc.append(model[rankings[i][1]])
        keywords.append(rankings[i][1])

    U, s, Vh = np.linalg.svd(modelLoc, full_matrices=False)
    scaler = MinMaxScaler(feature_range=(0.1, 0.9))
    normU = scaler.fit_transform(U)
    positions = {}
    for i in range(len(keywords)):
        positions[keywords[i]] = (float(normU[i, 0] + random.randrange(-10, 10, 2)*.01),
                                  float(normU[i, 1] + random.randrange(-10, 10, 2)*.01))
    return positions
