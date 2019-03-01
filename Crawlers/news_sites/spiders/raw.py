# -*- coding: utf-8 -*-
"""
Created on Thu Jun  8 05:13:16 2017

@author: lasithniro
"""

import scrapy
# from scrapy.spider import Spider
from news_sites.items import defaultItem
try:
    from urllib.parse import urljoin
except ImportError:
    from urlparse import urljoin

from scrapy.http import Request


class RAWSpider(scrapy.Spider):
    name = "raw"
    allowed_domains = ["raw.lk"]
    start_urls = ["http://www.raw.lk/news"]

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

            item = defaultItem()
            item['news_headline'] = news_headline

            item['news_link'] = news_url
            item['image_url'] = image_url

            item['newsInDetails'] = ""
            item["data"] = ""

            item["published_timestamp"] = ""
            item["author"] = ""
            item["link"] = ""
            item["comments"] = ""
            item["views"] = ""
            item["moreDetails"] = ""
            item["datetime"] = date_time
            item["telephone"] = ""
            item["sub_category"] = ""
            item["writer"] = ""
            item["img_src"] = ""

            r = Request(url=news_url, callback=self.parse_1)

            r.meta['item'] = item

            yield r

            items.append(item)
        yield {'data': items}
        # yield {"data": items}

        print("what is this",)
        myurl = response.request.url
        print("which url", myurl)
        category = myurl.split("/")[3]
        print("category", category)
        # goto next page
        for i in range(15, 3825, 15):
            next_url = "http://www.raw.lk/" + category + "/" + str(i)
            if next_url is not None:
                yield scrapy.Request(next_url, callback=self.parse)

    def parse_1(self, response):
        print("callback is called")
        path = response.css('div.row.inner-ft-text p ::text').extract()
        s = ' '.join(path)
        item = response.meta['item']
        item['newsInDetails'] = s
        print("callback yield is about be called")

        yield item
