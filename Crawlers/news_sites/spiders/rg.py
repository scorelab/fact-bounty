# -*- coding: utf-8 -*-
import scrapy
import dateutil.parser as dparser

from news_sites.items import NewsSitesItem


class RateGossipSpider(scrapy.Spider):
    name = "rategossip"
    allowed_domains = ["rategossip.com"]
    start_urls = ["http://www.rategossip.com/all-page.html"]

    def __init__(self, date=None, *args, **kwargs):
        super(RateGossipSpider, self).__init__(*args, **kwargs)

        if date is not None:
            self.dateToMatch = dparser.parse(date).date()
        else:
            self.dateToMatch = None

    def parse(self, response):
        for news_url in response.css(
            '.mnbtmwhite2title a::attr("href")'
        ).extract():
            yield response.follow(news_url, callback=self.parse_article)

        # next_page = response.css('.active+ li a::attr("href")').extract_first()
        # if next_page is not None:
        # yield response.follow(next_page, callback=self.parse)

    def parse_article(self, response):
        item = NewsSitesItem()

        item["author"] = "http://www.rategossip.com"
        item["title"] = response.css(".artititle a::text").extract_first()
        date = response.css(".artidate::text").extract_first()
        if date is None:
            return

        date = date.replace("\r", "")
        date = date.replace("\t", "")
        date = date.replace("\n", "")
        date = dparser.parse(date, fuzzy=True).date()

        # don't add news if we are using dateToMatch and date of news
        if self.dateToMatch is not None and self.dateToMatch != date:
            return

        img_link = response.css(".tpbtmimg2 img::attr(src)").extract()

        item["date"] = date.strftime("%d %B, %Y")
        item["imageLink"] = img_link
        item["source"] = "http://www.rategossip.com"
        item["news_url"] = response.url

        yield item
