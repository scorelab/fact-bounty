# -*- coding: utf-8 -*-
import scrapy
import dateutil.parser as dparser

from news_sites.items import NewsSitesItem


class ThePapareSpider(scrapy.Spider):
    name = "thepapare"
    allowed_domains = ["thepapare.com"]
    start_urls = ["http://www.thepapare.com/latest-news"]

    def __init__(self, date=None, *args, **kwargs):
        super(ThePapareSpider, self).__init__(*args, **kwargs)

        if date is not None:
            self.dateToMatch = dparser.parse(date, fuzzy=True).date()
        else:
            self.dateToMatch = None

    def parse(self, response):
        # extract news urls from news section
        temp = response.css(
            ".td_module_10 .td-module-title a::attr(href)"
        ).extract()

        # remove duplicate urls
        news_urls = []
        [news_urls.append(x) for x in temp if x not in news_urls]

        for news_url in news_urls:
            yield response.follow(news_url, callback=self.parse_article)

        # next_page = response.css('.fa-angle-double-right').xpath('../@href').extract_first()
        # if next_page is not None:
        #     yield response.follow(next_page, callback=self.parse)

    def parse_article(self, response):
        item = NewsSitesItem()

        item["author"] = response.css(
            ".td-post-author-name a::text"
        ).extract_first()
        item["title"] = response.css(
            ".td-post-title .entry-title::text"
        ).extract_first()
        date = response.css(
            ".td-post-title .td-module-date::text"
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
            ".td-modal-image .td-animation-stack-type0-1::attr(src)"
        ).extract_first()
        item["source"] = "http://www.thepapare.com"
        item["content"] = "\n".join(
            response.css(".td-post-content p::text").extract()
        )
        item["news_url"] = response.url

        yield item
