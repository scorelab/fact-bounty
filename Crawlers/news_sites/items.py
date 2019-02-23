# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class NewsSitesItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass


class NFItem(scrapy.Item):
    news_headline = scrapy.Field()
    published_timestamp = scrapy.Field()
    author = scrapy.Field()
    link = scrapy.Field()
    data = scrapy.Field()
    imgURL = scrapy.Field()


class CTItem(scrapy.Item):
    news_headline = scrapy.Field()
    #published_timestamp = scrapy.Field()
    #comments = scrapy.Field()
    #views = scrapy.Field()
    # moreDetails=scrapy.Field()
    link = scrapy.Field()
    data = scrapy.Field()


class chaptersItem(scrapy.Item):
    news_headline = scrapy.Field()
    link = scrapy.Field()
    newsInDetails = scrapy.Field()


class DailyMirrorSportsItem(scrapy.Item):
    news_headline = scrapy.Field()
    link = scrapy.Field()
    data = scrapy.Field()
    newsInDetails = scrapy.Field()


class DailyMirrorItem(scrapy.Item):
    news_headline = scrapy.Field()
    published_timestamp = scrapy.Field()
    comments = scrapy.Field()
    views = scrapy.Field()
    moreDetails = scrapy.Field()
    link = scrapy.Field()
    data = scrapy.Field()


class LDItem(scrapy.Item):
    news_headline = scrapy.Field()
    published_timestamp = scrapy.Field()
    link = scrapy.Field()
    data = scrapy.Field()


class EconomyNextItem(scrapy.Item):
    news_headline = scrapy.Field()
    link = scrapy.Field()
    datetime = scrapy.Field()
    newsInDetails = scrapy.Field()


class GeneralItem(scrapy.Item):
    news_headline = scrapy.Field()
    link = scrapy.Field()
    datetime = scrapy.Field()
    newsInDetails = scrapy.Field()


class AutoLankaItem(scrapy.Item):
    news_headline = scrapy.Field()
    link = scrapy.Field()
    telephone = scrapy.Field()
    newsInDetails = scrapy.Field()


class FtItem(scrapy.Item):
    news_headline = scrapy.Field()
    date = scrapy.Field()
    data = scrapy.Field()
    news_link = scrapy.Field()


class PulseItem(scrapy.Item):
    news_headline = scrapy.Field()
    date = scrapy.Field()
    comment = scrapy.Field()
    newsInDetails = scrapy.Field()
    news_link = scrapy.Field()


class RoarItem(scrapy.Item):
    news_headline = scrapy.Field()
    imgURL = scrapy.Field()
    newsInDetails = scrapy.Field()
    news_link = scrapy.Field()
    date = scrapy.Field()


class ReadMeItem(scrapy.Item):
    sub_category = scrapy.Field()
    news_headline = scrapy.Field()
    newsInDetails = scrapy.Field()
    news_link = scrapy.Field()
    date = scrapy.Field()
    writer = scrapy.Field()


class ThePapareItem(scrapy.Item):
    news_headline = scrapy.Field()
    newsInDetails = scrapy.Field()
    news_link = scrapy.Field()
    date = scrapy.Field()
    writer = scrapy.Field()
    img_src = scrapy.Field()
    comments = scrapy.Field()


class NationlkItem(scrapy.Item):
    news_headline = scrapy.Field()
    newsInDetails = scrapy.Field()
    news_link = scrapy.Field()
    date = scrapy.Field()
    writer = scrapy.Field()


class adaDeraneItem(scrapy.Item):
    news_headline = scrapy.Field()
    newsInDetails = scrapy.Field()
    news_link = scrapy.Field()
    date = scrapy.Field()
    image_url = scrapy.Field()
