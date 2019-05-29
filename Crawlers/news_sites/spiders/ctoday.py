# -*- coding: utf-8 -*-
import scrapy
from scrapy.http import Request

from ..items import NewsSitesItem


class CtodaySpider(scrapy.Spider):
    name = "ctoday"
    allowed_domains = ["ceylontoday.lk"]
    start_urls = ['http://www.ceylontoday.lk/news/8', 'http://www.ceylontoday.lk/news/5',
                  'http://www.ceylontoday.lk/news/14', 'http://www.ceylontoday.lk/news/7',
                  'http://www.ceylontoday.lk/news/4', 'http://www.ceylontoday.lk/news/6',
                  'http://www.ceylontoday.lk/news/2', 'http://www.ceylontoday.lk/news/15']

    def parse(self, response):
        for news_url in response.css('.news-text-link').extract():
            yield response.follow(news_url, callback=self.parse_article)

        # next_page = response.css('').extract_first()
        # if next_page is not None:
        #     yield response.follow(next_page, callback=self.parse)


    def parse_article(self, response):
        item = NewsSitesItem()

        item['author'] = response.css('.news-meta-author-text::text').extract_first()
        item['title'] = response.css('.news-title::text').extract_first()
        item['date']  = response.css('.news-meta-date-text::text').extract_first()
        item['imageLink'] = response.css('.news-main-img::attr(src)').extract_first()
        item['source'] = 'http://www.ceylontoday.lk'
        item['content'] = ' \n '.join(response.css('.news-content-holder::text').extract())

        yield item
