from elasticsearch import Elasticsearch
import json

es = Elasticsearch()

with open('dump/stories.json', 'r') as read:
	data = json.load(read)
	i = 1
	for row in data:
		es.index(index='factbounty', doc_type='story', id=i, body=row)
		i = i + 1