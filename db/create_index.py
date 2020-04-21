"""
Create ElasicSearch index
"""
from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")
index_name = "test5"

# Setting mappings for index
mapping = {
    "mappings": {
        "stories": {
            "properties": {
                "date": {"type": "date"},
                "author": {"type": "keyword"},
                "title": {"type": "keyword"},
                "content": {"type": "keyword"},
                "imageLink": {"type": "keyword"},
                "source": {"type": "keyword"},
                "approved_count": {"type": "keyword"},
                "fake_count": {"type": "integer"},
                "mixedvote_count": {"type": "integer"},
            }
        }
    }
}


es.index(index=index_name, body=mapping)
