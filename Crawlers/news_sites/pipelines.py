# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
# import pymongo
import mysql.connector
from scrapy.conf import settings
from scrapy.exceptions import DropItem
from scrapy import log
import hashlib


class NewsSitesPipeline(object):
    def process_item(self, item, spider):
        return item


class SQLPipeline(object):

    def __init__(self):
        self.create_connection()
        self.create_table()

    def create_connection(self):
        self.conn = mysql.connector.connect(
            host='localhost',
            user='root',
            passwd='Iamakata01',
            database='news'
        )
        self.curr = self.conn.cursor()

    def create_table(self):
        self.curr.execute("""
            alter database news character set utf8mb4 collate utf8mb4_unicode_ci
        """)
        self.curr.execute("""DROP TABLE IF EXISTS allnews""")

        self.curr.execute("""create table allnews(
            news_headline TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
            data TEXT,
            image_url TEXT,
            published_timestamp TEXT,
            author TEXT,
            comments TEXT,
            views TEXT,
            link TEXT,
            moreDetails TEXT,
            newsInDetails  TEXT,
            news_link TEXT,
            datetime TEXT,
            telephone TEXT,
            sub_category TEXT,
            writer TEXT,
            img_src TEXT,
            upvote INT,
            downvote INT,
            mixedvote INT
            )
            """)

    def process_item(self, item, spider):

        self.store_db(item, spider)

        return item

    def store_db(self, item, spider):
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

        if 'data' in item:

            for i in item["data"]:
                self.curr.execute("""
                    insert into allnews (news_headline, data, image_url, published_timestamp, link, author, comments, views, moreDetails, newsInDetails, news_link,
                    datetime, telephone, sub_category, writer, img_src, upvote, downvote, mixedvote) values ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %d, %d, %d)
                    """, (i["news_headline"], i["data"], i["image_url"], i["published_timestamp"], i["link"], i["author"], i["comments"], i["views"], i["moreDetails"],
                          i["newsInDetails"], i["news_link"], i["datetime"], i["telephone"], i["sub_category"], i["writer"], i["img_src"], 0, 0, 0))
            self.conn.commit()

        else:

            check = self.curr.execute(
                "select * from allnews where news_headline = '{x1}'".format(x1=item["news_headline"]))

            if check == 0:
                self.curr.execute("""
                    insert into allnews (news_headline, data, image_url, published_timestamp, link, author, comments, views, moreDetails, newsInDetails, news_link,
                    datetime, telephone, sub_category, writer, img_src, upvote, downvote, mixedvote) values ( %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %d, %d, %d)
                    """, (i["news_headline"], i["data"], i["image_url"], i["published_timestamp"], i["link"], i["author"], i["comments"], i["views"], i["moreDetails"],
                          i["newsInDetails"], i["news_link"], i["datetime"], i["telephone"], i["sub_category"], i["writer"], i["img_src"], 0, 0, 0))
                self.conn.commit()
            else:
                self.curr.execute("""
                        update allnews set newsInDetails = '{x1}' , data = '{x2}'
                    """.format(x1=item["newsInDetails"], x2=item["data"]))

                self.conn.commit()


# class MongodbPipeline(object):
    # def __init__(self):
 #   connection = pymongo.MongoClient(
  #      settings['MONGODB_SERVER'],
   #     settings['MONGODB_PORT']
   # )
   # db = connection[settings['MONGODB_DB']]
   # self.collection = db["news_db"]

    # @classmethod
    # def from_crawler(cls, crawler):
 #   return cls(
  #      mongo_uri=crawler.settings.get('MONGODB_URL'),
   #     mongo_db=crawler.settings.get('MONGODB_DB', 'defautlt-test')
        # )

    # def open_spider(self, spider):
 #   self.client = pymongo.MongoClient(self.mongo_uri)
  #  self.db = self.client[self.mongo_db]

   # def close_spider(self, spider):
    #    self.client.close()

    # def process_item(self, item, spider):
 #   self.db[self.collection_name].insert(dict(item))
  #  return item
