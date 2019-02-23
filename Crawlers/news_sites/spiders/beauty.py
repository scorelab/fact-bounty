import scrapy
from scrapy.spiders import Spider
from news_sites.items import GeneralItem
from urllib.parse import urljoin
import datetime
from scrapy.http import Request
import re


class BeautySpider(scrapy.Spider):
    name = "beautifulu"
    allowed_domains = ["beautifulu.lk"]
    start_urls = ['http://beautifulu.lk/beauty-all/']

    def parse(self, response):
        items = []
        for news in response.css('div.small-12.medium-4.large-4.columns'):
            # print(news_arr)
            item = GeneralItem()
            # append to items object
            item['news_headline'] = news.css(
                'header.post-title.entry-header h5 ::text').extract_first()
            item['datetime'] = news.css(
                'aside.post-author.cf time ::text').extract_first()
            news_url = news.css(
                'header.post-title.entry-header h5 a ::attr(href)').extract_first()
            item['link'] = news_url
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        yield {"data": items}

    def parse_1(self, response):
        data = response.css(
            'div.post-content.entry-content.cf p ::text').extract()
        data = data[:-1]
        texts = [i.strip() for i in data]
        new_texts = list(filter(None, texts))
        string = ' '.join(new_texts)
        item = response.meta['item']
        item['newsInDetails'] = string
        yield item
