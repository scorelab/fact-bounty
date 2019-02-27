#!/usr/bin/python3
import scrapy
from scrapy.spiders import Spider
from news_sites.items import GeneralItem
from urllib.parse import urljoin
import datetime
from scrapy.http import Request
import re


class FoodSpider(scrapy.Spider):
    name = "yamu-foods"
    allowed_domains = ["yamu.lk"]
    start_urls = ['https://www.yamu.lk/recipe']

    def parse(self, response):
        items = []
        for news in response.css('a.front-group-item.item'):
            # print(news_arr)
            item = GeneralItem()
            # append to items object
            item['news_headline'] = news.css(
                'h3.front-h3 ::text').extract_first().strip()
            item['datetime'] = "not in use"
            news_url = news.css('::attr(href)').extract_first()
            item['link'] = news_url
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        yield {"newsInDetails": items}

        for i in range(1, 8):
            next_page = "https://www.yamu.lk/recipe?page="+str(i)
            yield scrapy.Request(next_page, callback=self.parse)

    def parse_1(self, response):
        data = response.css('li.rcp-step ::text').extract()
        texts = [i.strip() for i in data]
        new_texts = list(filter(None, texts))
        string = ' '.join(new_texts)
        item = response.meta['item']
        item['newsInDetails'] = string
        yield item
