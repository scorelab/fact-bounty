# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import Spider
from news_sites.items import DailyMirrorSportsItem
from urllib.parse import urljoin
from scrapy.http import Request


class DM_medicine(scrapy.Spider):
    name = "dm-medicine"
    allowed_domains = ["dailymirror.lk"]
    start_urls = ["http://www.dailymirror.lk/medicine"]

    def parse(self, response):
        items = []
        for news in response.css('div.media'):
            headline = news.css(
                'h2.media-heading.cat-header a ::text').extract_first()
            news_url = news.css(
                'h2.media-heading.cat-header a ::attr(href)').extract_first()
            item = DailyMirrorSportsItem()
            item['news_headline'] = headline
            item['link'] = news_url
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)

        yield {'newsInDetails': items}

        # next_link = response.css('a.nextpostslink ::attr(href)').extract_first()
        # if next_link is not None:
        #     next_url = urljoin(response.url, str(next_link))
        #     print("scrpping "+next_url)
        #     yield scrapy.Request(next_url, callback=self.parse)

        # for i in range(30, 630, 30):
        #     next_url = "http://www.dailymirror.lk/medicine/"+str(i)
        #     yield scrapy.Request(next_url, callback=self.parse)

    def parse_1(self, response):
        path = response.css('div.row.inner-text p ::text').extract()
        path = [i.strip() for i in path]
        path = list(filter(None, path))
        s = ' '.join(path)
        item = response.meta['item']
        item['newsInDetails'] = s
        yield item
