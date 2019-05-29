# -*- coding: utf-8 -*-
import scrapy
# from urllib.parse import urljoin
from scrapy.http import Request

from ..items import NewsSitesItem


class BizadaDeranaSpider(scrapy.Spider):
    name = "bizada"
    allowed_domains = ["adaderana.lk"]
    start_urls = ['http://bizenglish.adaderana.lk/category/top-news/',
                  'http://bizenglish.adaderana.lk/category/news-2/',
                  'http://bizenglish.adaderana.lk/category/analysis/',
                  'http://bizenglish.adaderana.lk/category/features/']

    def parse(self, response):
        for news_url in response.css('.business-image .wp-post-image , h3 a::attr("href")').extract():
            yield response.follow(news_url, callback=self.parse_article)

        next_page = response.css('ul.pager a[title*=next]::attr("href")').extract_first()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)


    def parse_article(self, response):
        item = NewsSitesItem()

        item['author'] = 'bizada'
        item['title'] = response.css('.news-header h3::text').extract_first()
        item['date']  = response.css('.news-date::text').extract()[1]
        item['imageLink'] = response.css('.wp-post-image::attr(src)').extract_first()
        item['source'] = 'http://bizenglish.adaderana.lk'
        item['content'] = ' \n '.join(response.css('.news-text::text').extract())

        yield item
