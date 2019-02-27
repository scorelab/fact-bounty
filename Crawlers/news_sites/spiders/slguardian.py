# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import Spider
from news_sites.items import adaDeraneItem
from urllib.parse import urljoin
from scrapy.http import Request


class slgurdianSpider(scrapy.Spider):
    name = "slg"
    allowed_domains = ["slguardian.org"]
    start_urls = ['http://www.slguardian.org/?cat=53', 'http://www.slguardian.org/?cat=46', 'http://www.slguardian.org/?cat=4167', 'http://www.slguardian.org/?cat=64', 'http://www.slguardian.org/?cat=1232', 'http://www.slguardian.org/?cat=109',
                  'http://www.slguardian.org/?cat=7', 'http://www.slguardian.org/?cat=13', 'http://www.slguardian.org/?cat=4445', 'http://www.slguardian.org/?cat=75']

    def parse(self, response):
        items = []
        # panel panel-default panel-latestst
        i = 0
        for news in response.css('article.widget-entry.entry-large.col-sm-6'):
            news_headline = news.css(
                'header.entry-header h3.entry-title a ::text').extract_first()
            news_url = news.css(
                'header.entry-header h3.entry-title a ::attr(href)').extract_first()
            image_url = news.css(
                'div.entry-thumbnail a ::attr(src)').extract_first()
            date_time = news.css(
                'header.entry-header div.entry-meta.small.text-uppercase span.entry-category span.entry-date ::text').extract_first()

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
        next_url = response.css(
            'div.nav-links a.next.page-numbers ::attr(href)').extract_first()
        if next_url is not None:
            yield scrapy.Request(next_url, callback=self.parse)

    def parse_1(self, response):
        path = response.css('div.entry-content p ::text').extract()
        s = ' '.join(path)
        item = response.meta['item']
        item['newsInDetails'] = s
        yield item
