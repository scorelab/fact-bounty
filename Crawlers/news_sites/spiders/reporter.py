# -*- coding: utf-8 -*-
#!/usr/bin/python3
import scrapy
from scrapy.spiders import Spider
from news_sites.items import adaDeraneItem
from urllib.parse import urljoin
from scrapy.http import Request


class reporterSpider(scrapy.Spider):
    name = "reporter"
    allowed_domains = ["reporter.lk"]
    start_urls = ['http://reporter.lk/category/world/']

    def parse(self, response):
        items = []
        # panel panel-default panel-latestst
        i = 0
        for news in response.css('article.post'):
            news_headline = news.css(
                'header.entry-header h1.entry-title a ::text').extract_first()
            news_url = news.css(
                'header.entry-header h3.entry-title a ::attr(href)').extract_first()
            image_url = news.css(
                'div.post-image a img ::attr(src)').extract_first()
            date_time = news.css(
                'div.entry-meta span.posted-on time.entry-date ::text').extract_first()

            item = adaDeraneItem()
            item['news_headline'] = news_headline
            item['date'] = date_time
            item['news_link'] = news_url
            item['image_url'] = image_url
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        yield {'data': items}
        # yield {"data": items}

        # goto next page
        '''
        next_url = response.css('div.nav-previous ::attr(href)').extract_first()
        if next_url is not None:
            next_url = response.urljoin(next_url)
            yield scrapy.Request(next_url, callback=self.parse)
        '''

    def parse_1(self, response):
        path = response.css('div.bdytext ::text').extract()
        s = ' '.join(path)
        item = response.meta['item']
        item['newsInDetails'] = s
        yield item
