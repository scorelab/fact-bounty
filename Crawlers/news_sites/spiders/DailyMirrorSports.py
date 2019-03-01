# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import Spider
from news_sites.items import defaultItem
try:
    from urllib.parse import urljoin
except ImportError:
    from urlparse import urljoin

from scrapy.http import Request


class DailymirrorSportsSpider(scrapy.Spider):
    name = "DailyMirrorSports"
    allowed_domains = ["sports.dailymirror.lk"]
    start_urls = ["http://www.dailymirror.lk/article/"]

    def parse(self, response):
        items = []
        for news in response.css('#categorycontent'):
            headline = news.css('h2 ::text').extract_first()
            news_url = news.css('h2 ::attr(href)').extract_first()
            item = defaultItem()
            item['news_headline'] = headline
            item['link'] = news_url

            item['newsInDetails'] = ""
            item["data"] = ""
            item['news_link'] = news_url
            item['image_url'] = ""
            item["published_timestamp"] = ""
            item["author"] = ""

            item["comments"] = ""
            item["views"] = ""
            item["moreDetails"] = ""
            item["datetime"] = ""
            item["telephone"] = ""
            item["sub_category"] = ""
            item["writer"] = ""
            item["img_src"] = ""

            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        # if 'data' in item:
        yield {'data': items}

        next_link = response.css(
            'a.nextpostslink ::attr(href)').extract_first()
        if next_link is not None:
            next_url = urljoin(response.url, str(next_link))
            print("scrpping "+next_url)
            yield scrapy.Request(next_url, callback=self.parse)

    def parse_1(self, response):
        path = response.css('div.postarea p ::text').extract()
        path = [i.strip() for i in path]
        path = list(filter(None, path))
        s = ' '.join(path)
        item = response.meta['item']
        item['data'] = s
        yield item
