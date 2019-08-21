# -*- coding: utf-8 -*-
import scrapy
import dateutil.parser as dparser

from news_sites.items import NewsSitesItem


class hriuSpider(scrapy.Spider):
    name = "hirunews"
    allowed_domains = ["hirunews.lk"]
    start_urls = [
        "http://www.hirunews.lk/sinhala/local-news.php",
        "http://www.hirunews.lk/sinhala/international-news.php",
        "http://www.hirunews.lk/sinhala/sports/",
        "http://www.hirunews.lk/sinhala/business/",
    ]

    def __init__(self, date=None):
        if date is not None:
            self.dateToMatch = dparser.parse(date).date()
        else:
            self.dateToMatch = None

    def parse(self, response):
        for news_url in response.css(
            '.lts-cntp a ::attr("href")'
        ).extract():
            yield response.follow(news_url, callback=self.parse_article)

        next_page = response.css('a:nth-child(4)::attr("href")').extract_first()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)

    def parse_article(self, response):
        item = NewsSitesItem()

        item["author"] = "http://www.hirunews.lk"
        item["title"] = response.css(".lts-cntp2::text").extract_first()
        date = response.css(".time::text").extract()[1]
        if date is None:
            return

        date = date.replace("\r", "")
        date = date.replace("\t", "")
        date = date.replace("\n", "")
        date = dparser.parse(date, fuzzy=True).date()

        # don't add news if we are using dateToMatch and date of news
        if self.dateToMatch is not None and self.dateToMatch != date:
            return

        img_link = response.css(".latest-pic img::attr(src)").extract_first()
        
        item["date"] = date.strftime("%d %B, %Y")
        item["imageLink"] = img_link
        item["source"] = "http://www.hirunews.lk"
        item["content"] = " \n ".join(
            response.css(".lts-txt2::text").extract()
        )

        yield item
