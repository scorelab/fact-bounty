import scrapy
from scrapy.spiders import Spider
from news_sites.items import GeneralItem
from urllib.parse import urljoin
import datetime
from scrapy.http import Request
import re


class FoodSpider(scrapy.Spider):
    name = "dm-foods"
    allowed_domains = ["life.dailymirror.lk"]
    start_urls = ['http://life.dailymirror.lk/foodfactor/227/reviews',
                  'http://life.dailymirror.lk/foodfactor/198/recipes']

    def parse(self, response):
        items = []
        for news in response.css('article.entry-item'):
            # print(news_arr)
            item = GeneralItem()
            # append to items object
            item['news_headline'] = news.css(
                'h6.entry-title a ::text').extract_first()
            item['datetime'] = "not in use"
            news_url = news.css(
                'h6.entry-title a ::attr(href)').extract_first()
            item['link'] = news_url
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        yield {"newsInDetails": items}

        next_page = response.css(
            'div.pagination.clearfix ul.page-numbers.clearfix li a.last.page-numbers ::attr(href)').extract_first()
        if next_page is not None:
            print(next_page)
            next_page = str(next_page)
            yield scrapy.Request(next_page, callback=self.parse)

    def parse_1(self, response):
        data = response.css(
            'div.entry-content.clearfix div span ::text').extract()
        texts = [i.strip() for i in data]
        new_texts = list(filter(None, texts))
        string = ' '.join(new_texts)
        item = response.meta['item']
        item['newsInDetails'] = string
        yield item
