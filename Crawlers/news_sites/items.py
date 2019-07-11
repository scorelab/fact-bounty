# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class NewsSitesItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = scrapy.Field()
    author = scrapy.Field()
    content = scrapy.Field()
    date = scrapy.Field()
    imageLink = scrapy.Field()
    source = scrapy.Field()
    approved_count = scrapy.Field()
    fake_count = scrapy.Field()
    mixedvote_count = scrapy.Field()
