# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import Spider
from news_sites.items import LDItem
from urllib.parse import urljoin
from scrapy.http import Request


class LankadeepaSpider(scrapy.Spider):
    name = "lankadeepa"
    allowed_domains = ["lankadeepa.lk"]
    start_urls = ['http://www.lankadeepa.lk/latest_news/1']

    def parse(self, response):
        items = []
        i = 0
        for news in response.css('div.row'):
            news_url = news.css(
                'div.simple-thumb a ::attr(href)').extract_first()
            title = news.css(
                'div.simple-thumb a.news-title ::text').extract_first()
            timedate = news.css(
                'div.simple-thumb p.timeandauthor small ::text').extract_first()
            # content = news.css('div.simple-thumb p.catexcerpt ::text').extract_first()
            item = LDItem()
            if(news_url != None):
                # print(news_url)
                # print(title)
                # print(str(timedate))
                # print("\n")
                item['news_headline'] = title
                item['published_timestamp'] = timedate
                item['link'] = news_url
                r = Request(url=news_url, callback=self.parse_1)
                r.meta['item'] = item
                yield r
                items.append(item)
        yield items

        next_url = response.css(
            'a.last.page-numbers ::attr(href)').extract_first()
        yield scrapy.Request(next_url, callback=self.parse)

    def parse_1(self, response):
        path = response.css('div.row.post-header')
        path = path.css('header.post-content p ::text').extract()
        path = path[1:]
        path = [i.strip() for i in path]
        path = list(filter(None, path))
        s = ' '.join(path)
        item = response.meta['item']
        item['data'] = s
        yield item
