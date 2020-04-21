# -*- coding: utf-8 -*-
import scrapy
from scrapy.http import Request
import dateutil.parser as dparser

from ..items import NewsSitesItem


class BizadaDeranaSpider(scrapy.Spider):
    name = "bizada"
    allowed_domains = ["adaderana.lk"]
    start_urls = [
        "http://bizenglish.adaderana.lk/category/top-news/",
        "http://bizenglish.adaderana.lk/category/news-2/",
        "http://bizenglish.adaderana.lk/category/analysis/",
        "http://bizenglish.adaderana.lk/category/features/",
    ]

    def __init__(self, date=None, *args, **kwargs):
        super(BizadaDeranaSpider, self).__init__(*args, **kwargs)
        if date is not None:
            self.dateToMatch = dparser.parse(date, fuzzy=True).date()
        else:
            self.dateToMatch = None

    def parse(self, response):
        for news_url in response.css(
            '.business-image .wp-post-image , h3 a::attr("href")'
        ).extract():
            yield response.follow(news_url, callback=self.parse_article)

        next_page = response.css(
            'ul.pager a[title*=next]::attr("href")'
        ).extract_first()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)

    def parse_article(self, response):
        item = NewsSitesItem()

        item["author"] = "bizada"
        item["title"] = response.css(".news-header h3::text").extract_first()
        date = response.css(".news-date::text").extract_first()
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
            ".wp-post-image::attr(src)"
        ).extract_first()
        item["source"] = response.url
        item["content"] = " \n ".join(
            response.css(".news-text::text").extract()
        )
        item["news_url"] = response.url

        yield item
