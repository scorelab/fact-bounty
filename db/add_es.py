from elasticsearch import Elasticsearch
import json
import os

ELASTICSEARCH_URL = '127.0.0.1'

es = Elasticsearch(
	[ELASTICSEARCH_URL],
	port=9200
        )

with open(os.path.join(os.path.dirname(__file__),'dump/stories.json'), 'r') as read:
	data = json.load(read)
	i = 1
	for row in data:
		es.index(index='factbounty', doc_type='story', id=i, body=row)
		i = i + 1
