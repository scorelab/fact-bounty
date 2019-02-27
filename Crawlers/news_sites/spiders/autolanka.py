import scrapy
from scrapy.spiders import Spider
from news_sites.items import AutoLankaItem
from urllib.parse import urljoin
import datetime
from scrapy.http import Request
import re


class CarSpider(scrapy.Spider):
    name = "autolanka"
    allowed_domains = ["autolanka.com"]
    start_urls = ['http://www.autolanka.com/cars/']

    def parse(self, response):
        items = []
        for news in response.css('div.ia-card__content'):
            # print(news_arr)
            item = AutoLankaItem()
            # append to items object
            item['news_headline'] = news.css(
                'a.ia-card__title ::text').extract_first()
            item['telephone'] = news.css('strong a  ::text').extract_first().split(':')[
                1].rsplit()[0]
            item['link'] = news.css(
                'a.ia-card__title ::attr(href)').extract_first()
            item['newsInDetails'] = news.css(
                'p.ia-car-summary  ::text').extract_first()
            items.append(item)
        yield {"data": items}

        for i in range(2, 277):
            next_page = "http://www.autolanka.com/cars/?page="
            next_page = next_page+str(i)
            yield scrapy.Request(next_page, callback=self.parse)
