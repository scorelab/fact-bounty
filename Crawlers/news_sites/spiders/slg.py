# -*- coding: utf-8 -*-
import scrapy
import dateutil.parser as dparser

from ..items import NewsSitesItem


class slgurdianSpider(scrapy.Spider):
    name = "slg"
    allowed_domains = ["srilankaguardian.org"]
    start_urls = ["http://www.srilankaguardian.org/search"]

    def __init__(self, date=None, *args, **kwargs):
        super(slgurdianSpider, self).__init__(*args, **kwargs)

        if date is not None:
            self.dateToMatch = dparser.parse(date, fuzzy=True).date()
        else:
            self.dateToMatch = None

    def parse(self, response):
        # extract news urls from news section
        temp = response.css(".entry-title a::attr(href)").extract()

        # remove duplicate urls
        news_urls = []
        [news_urls.append(x) for x in temp if x not in news_urls]

        for news_url in news_urls:
            yield response.follow(news_url, callback=self.parse_article)

        next_page = response.css(
            "blog-pager-older-link::attr(href)"
        ).extract_first()

        if next_page is not None:
            yield response.follow(next_page, callback=self.parse_page)

    def parse_page(self, response):

        # extract news urls from news section
        temp = response.css(".entry-title a::attr(href)").extract()

        # remove duplicate urls
        news_urls = []
        [news_urls.append(x) for x in temp if x not in news_urls]

        for news_url in news_urls:
            yield response.follow(news_url, callback=self.parse_article)

        next_page = (
            response.css(".fa-angle-double-right")
            .xpath("../@href")
            .extract_first()
        )

        if next_page is not None:
            yield response.follow(next_page, callback=self.parse_page)

    def parse_article(self, response):
        item = NewsSitesItem()

        item["author"] = response.css(
            ".entry-content div div b::text"
        ).extract_first()
        item["title"] = response.css(".entry-title::text").extract_first()
        date = response.css(".published::text").extract_first()
        if date is None:
            return

        date = date.replace("\r", "")
        date = date.replace("\t", "")
        date = date.replace("\n", "")
        date = dparser.parse(date, fuzzy=True).date()

        # don't add news if we are using dateToMatch and date of news
        if self.dateToMatch is not None and self.dateToMatch != date:
            return

        item["date"] = date.strftime("%d %B, %Y")
        item["imageLink"] = response.css(
            "#Blog1 img::attr(src)"
        ).extract_first()
        item["source"] = "http://www.srilankaguardian.org"
        item["content"] = " \n ".join(
            response.css(".entry-content div::text").extract()
        )
        item["news_url"] = response.url

        yield item
