# -*- coding: utf-8 -*-
import scrapy
from scrapy.http import Request

from ..items import NewsSitesItem


class LankadeepaSpider(scrapy.Spider):
    name = "lankadeepa"
    allowed_domains = ["lankadeepa.lk"]
    start_urls = ['http://www.lankadeepa.lk/latest_news/1']

    def parse(self, response):
        for news_url in response.css('.news-title::attr("href")').extract():
            yield response.follow(news_url, callback=self.parse_article)

        next_page = response.css('.page-numbers::attr("href")').extract_first()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)

    def parse_article(self, response):
        item = NewsSitesItem()

        item['author'] = 'http://www.lankadeepa.lk'
        item['title'] = response.css('.post-title::text').extract_first()
        item['date']  = response.css('.post-date::text').extract_first()
        item['imageLink'] = None
        item['source'] = 'http://www.lankadeepa.lk'
        item['content'] = ' \n '.join(response.css('.post-content p::text').extract())

        yield item
