# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import Spider
from news_sites.items import adaDeraneItem
from urllib.parse import urljoin
from scrapy.http import Request


class LankaNewsWebSpider(scrapy.Spider):
    name = "lnw"
    allowed_domains = ["sinhala.lankanewsweb.net"]
    start_urls = ['http://sinhala.lankanewsweb.net/news/special-news']

    def parse(self, response):
        items = []
        # panel panel-default panel-latestst
        i = 0
        for news in response.css('div.itemContainer'):
            news_headline = news.css(
                'div.catItemHeader h3.catItemTitle a ::text').extract_first()
            news_url = news.css(
                'div.catItemHeader h3.catItemTitle a ::attr(href)').extract_first()
            image_url = news.css(
                'div.catItemImageBlock a img attr(src)').extract_first()
            date_time = news.css(
                'aside.article-aside dl.article-info dd.create ::text').extract_first()

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
            'div.k2Pagination ul.pagination li a[title*=Next] ::attr(href)').extract_first()
        if next_url is not None:
            yield scrapy.Request(next_url, callback=self.parse)

    def parse_1(self, response):
        path = response.css('div.itemFullText ::text').extract()
        s = ' '.join(path)
        item = response.meta['item']
        item['newsInDetails'] = s
        yield item
