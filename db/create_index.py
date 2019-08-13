"""
Create ElasicSearch index
"""
from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")
index_name = "test3"

# Setting mappings for index
mapping = {
    "mappings": {
        "story": {
            "properties": {
                "date": {"type": "date"},
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


es.indices.create(index=index_name, body=mapping)
