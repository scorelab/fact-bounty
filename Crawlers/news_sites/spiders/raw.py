# -*- coding: utf-8 -*-
"""
Created on Thu Jun  8 05:13:16 2017

@author: lasithniro
"""

import scrapy
#from scrapy.spider import Spider
from news_sites.items import adaDeraneItem
#from urllib.parse import urljoin
from scrapy.http import Request


class RAWSpider(scrapy.Spider):
    name = "raw"
    allowed_domains = ["raw.lk"]
    start_urls = ["http://www.raw.lk/news", "http://www.raw.lk/gossip", "http://www.raw.lk/foreign_news", "http://www.raw.lk/sports",
                  "http://www.raw.lk/investigation", "http://www.raw.lk/entertainment"]

    def parse(self, response):
        items = []
        # panel panel-default panel-latestst
        i = 0
        for news in response.css('div.row.cat-zero'):
            news_headline = news.css(
                'div.col-md-7 a h1.cat-header ::text').extract_first()
            news_url = news.css('div.col-md-7 a ::attr(href)').extract_first()
            image_url = news.css(
                'div.col-md-5 a img.img-responsive ::attr(src)').extract_first()
            date_time = news.css(
                'div.col-md-7 p.cat-other span ::text').extract_first()

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

        myurl = response.request.url
        category = myurl.split("/")[3]
        # goto next page
        for i in range(15, 3825, 15):
            next_url = "http://www.raw.lk/" + category + "/" + str(i)
            if next_url is not None:
                yield scrapy.Request(next_url, callback=self.parse)

    def parse_1(self, response):
        path = response.css('div.row.inner-ft-text p ::text').extract()
        s = ' '.join(path)
        item = response.meta['item']
        item['newsInDetails'] = s
        yield item
