# -*- coding: utf-8 -*-
import scrapy
import dateutil.parser as dparser

from ..items import NewsSitesItem


class ReadmelkSpider(scrapy.Spider):
    name = "readmelk"
    allowed_domains = ["readme.lk"]
    start_urls = ["http://www.readme.lk/"]

    def __init__(self, date=None):
        if date is not None:
            self.dateToMatch = dparser.parse(date, fuzzy=True).date()
        else:
            self.dateToMatch = None

    def parse(self, response):
        categories = response.css("#menu-main-menu-1 a::attr(href)").extract()
        for category in categories:
            yield response.follow(category, callback=self.parse_category)

    def parse_category(self, response):
        # extract all news articles urls
        temp = response.css(".td-module-title a::attr(href)").extract()

        # remove duplicates
        news_urls = []
        [news_urls.append(x) for x in temp if x not in news_urls]

        # crawl article from each news page
        for news_url in news_urls:
            yield response.follow(news_url, callback=self.parse_article)

        # proceed to next page
        # next_page = response.css('.next::attr(href)').extract_first()
        # if next_page is not None:
        #     yield response.follow(next_page, callback=self.parse)

    def parse_article(self, response):
        item = NewsSitesItem()

        item["author"] = response.css(".td-post-title a::text").extract_first()
        item["title"] = response.css(
            ".td-post-title .entry-title::text"
        ).extract_first()
        date = response.css(
            ".td-post-date-no-dot .td-module-date::text"
        ).extract_first()
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
            ".article-photo .set-image-border::attr(src)"
        ).extract_first()
        item["source"] = "http://www.readme.lk/"
        item["content"] = "\n".join(
            response.css("h2 , .td-post-content p::text").extract()
        )
        item["news_url"] = response.url

        yield item
