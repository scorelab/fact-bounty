# -*- coding: utf-8 -*-
import scrapy
import dateutil.parser as dparser

from news_sites.items import NewsSitesItem


class amSpider(scrapy.Spider):
    name = "am"
    allowed_domains = ["am.lk"]
    start_urls = [
        "http://am.lk/local-news",
        "http://am.lk/si-international",
        "http://am.lk/si-economy",
        "http://am.lk/sports",
    ]

    def __init__(self, date=None):
        if date is not None:
            self.dateToMatch = dparser.parse(date).date()
        else:
            self.dateToMatch = None

    def parse(self, response):
        for news_url in response.css(
            '.catItemTitle a ::attr("href")'
        ).extract():
            yield response.follow(news_url, callback=self.parse_article)

        next_page = response.css('.next::attr("href")').extract_first()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)

    def parse_article(self, response):
        item = NewsSitesItem()

        item["author"] = "http://am.lk"
        item["title"] = response.css(".itemTitle::text").extract_first()
        date = response.css(".itemDateCreated::text").extract()[1]
        if date is None:
            return

        date = date.replace("\r", "")
        date = date.replace("\t", "")
        date = date.replace("\n", "")
        date = dparser.parse(date, fuzzy=True).date()

        # don't add news if we are using dateToMatch and date of news
        if self.dateToMatch is not None and self.dateToMatch != date:
            return

        img_link = response.css("#k2Container img::attr(src)").extract_first()
        if img_link:
            img_link = "http://am.lk" + img_link

        item["date"] = date.strftime("%d %B, %Y")
        item["imageLink"] = img_link
        item["source"] = "http://am.lk"
        item["content"] = " \n ".join(
            response.css("#k2Container p::text").extract()
        )

        yield item
