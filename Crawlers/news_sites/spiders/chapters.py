import scrapy
from scrapy.spiders import Spider
from news_sites.items import chaptersItem
from urllib.parse import urljoin
import datetime
from scrapy.http import Request
import re


class ChaptersSpider(scrapy.Spider):
    name = "chapters"
    allowed_domains = ["chapters.lk"]
    start_urls = [
        'https://chapters.lk/index.php?route=product/category&path=60_75']

    def parse(self, response):
        items = []
        for news in response.css('div.name'):
            # print(news_arr)
            item = chaptersItem()
            # append to items object
            item['news_headline'] = news.css('::text').extract_first()
            news_url = news.css('a ::attr(href)').extract_first()
            item['link'] = news_url
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        yield {"newsInDetails": items}

        for i in range(2, 104):
            next_url = "http://chapters.lk/index.php?route=product/category&path=60_75&page=" + \
                str(i)
            yield scrapy.Request(next_url, callback=self.parse)

    def parse_1(self, response):
        data = response.css('div.tab-content p ::text  ').extract()
        texts = [i.strip() for i in data]
        new_texts = list(filter(None, texts))
        string = ' '.join(new_texts)
        item = response.meta['item']
        item['newsInDetails'] = string
        yield item
