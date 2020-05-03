
from scripts.dataProcessing import countTweets, getTagData
from scripts.topicModeling import getCoords


def reducer(hashDf, allDf):
    rankings = countTweets(hashDf)
    positions = getCoords(rankings, allDf)
    finalList = []
    for item in rankings:
        tagData = getTagData(item, hashDf, positions[item[1]])
        if tagData != None:
            finalList.append(tagData)
    finalList.sort(key=pop)
    return finalList


def pop(e):
    val = int(e['Popularity'])
    return val

    
# def writeToFile(varList, name="data.json"):
#     print(varList)
#     with open(name, 'w') as filehandle:
#         json.dump(varList, filehandle)
