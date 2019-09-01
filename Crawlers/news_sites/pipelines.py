# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
import dateutil.parser as dparser
from elasticsearch import Elasticsearch, helpers


class NewsSitesPipeline(object):
    items_buffer = []

    def process_item(self, item, spider):
        # add vote columns with initialized value to 0
        item["approved_count"] = 0
        item["fake_count"] = 0
        item["mixedvote_count"] = 0

        # change date format to allow elasticsearch to detect it as date column
        date = dparser.parse(item["date"]).date()
        item["date"] = date.isoformat()

        # search if news article already exist in database
        body = {
            "query": {
                "multi_match": {
                    "query": item["news_url"],
                    "fields": ["news_url"],
                }
            }
        }
        res = self.es.search(
            index=self.settings["ELASTICSEARCH_INDEX"],
            doc_type=self.settings["ELASTICSEARCH_TYPE"],
            body=body,
        )["hits"]["hits"]

        # if it doesn't exist, append it to buffer
        if len(res) == 0:
            index_action = {
                "_index": self.settings["ELASTICSEARCH_INDEX"],
                "_type": self.settings["ELASTICSEARCH_TYPE"],
                "_source": dict(item),
            }
            # self.es.index(index=self.settings['ELASTICSEARCH_INDEX'], doc_type=self.settings['ELASTICSEARCH_TYPE'], body=dict(item))
            self.items_buffer.append(index_action)
            if len(self.items_buffer) >= 500:
                self.send_items()
                self.items_buffer = []

    def send_items(self):
        helpers.bulk(self.es, self.items_buffer)

    @classmethod
    def init_es_client(cls, crawler_settings):
        es_timeout = crawler_settings.get("ELASTICSEARCH_TIMEOUT", 60)

        es_servers = crawler_settings.get(
            "ELASTICSEARCH_SERVERS", "localhost:9200"
        )
        es_servers = (
            es_servers if isinstance(es_servers, list) else [es_servers]
        )

        es_settings = dict()
        es_settings["hosts"] = es_servers
        es_settings["timeout"] = es_timeout

        if (
            "ELASTICSEARCH_USERNAME" in crawler_settings
            and "ELASTICSEARCH_PASSWORD" in crawler_settings
        ):
            es_settings["http_auth"] = (
                crawler_settings["ELASTICSEARCH_USERNAME"],
                crawler_settings["ELASTICSEARCH_PASSWORD"],
            )

        if "ELASTICSEARCH_CA" in crawler_settings:
            import certifi

            es_settings["port"] = 443
            es_settings["use_ssl"] = True
            es_settings["ca_certs"] = crawler_settings["ELASTICSEARCH_CA"][
                "CA_CERT"
            ]
            es_settings["client_key"] = crawler_settings["ELASTICSEARCH_CA"][
                "CLIENT_KEY"
            ]
            es_settings["client_cert"] = crawler_settings["ELASTICSEARCH_CA"][
                "CLIENT_CERT"
            ]

        es = Elasticsearch(**es_settings)
        return es

    @classmethod
    def from_crawler(cls, crawler):
        ext = cls()
        ext.settings = crawler.settings

        ext.es = cls.init_es_client(crawler.settings)
        return ext

    def close_spider(self, spider):
        if len(self.items_buffer):
            self.send_items()
