# -*- coding: utf-8 -*-
import scrapy
import dateutil.parser as dparser

from news_sites.items import NewsSitesItem


class LankaHotNewsSpider(scrapy.Spider):
    name = "hotnews"
    allowed_domains = ["lankahotnews.net"]
    start_urls = ["https://www.lankahotnews.net/"]

    def __init__(self, date=None):
        if date is not None:
            self.dateToMatch = dparser.parse(date).date()
        else:
            self.dateToMatch = None

    def parse(self, response):
        for news_url in response.css('.entry-title a::attr("href")').extract():
            yield response.follow(news_url, callback=self.parse_article)

        # next_page = response.css('.active+ li a::attr("href")').extract_first()
        # if next_page is not None:
        # yield response.follow(next_page, callback=self.parse)

    def parse_article(self, response):
        item = NewsSitesItem()

        item["author"] = "https://www.lankahotnews.net/"
        item["title"] = response.css(".entry-title a::text").extract_first()
        date = ""

        # don't add news if we are using dateToMatch and date of news
        if self.dateToMatch is not None and self.dateToMatch != date:
            return

        img_link = response.css(".separator img::attr(src)").extract()

        item["imageLink"] = img_link
        item["source"] = "https://www.lankahotnews.net/"
        item["news_url"] = response.url

        yield item
