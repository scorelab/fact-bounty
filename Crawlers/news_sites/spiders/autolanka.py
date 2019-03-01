import scrapy
from scrapy.spiders import Spider
from news_sites.items import defaultItem
try:
    from urllib.parse import urljoin
except ImportError:
    from urlparse import urljoin

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
            item = defaultItem()
            # append to items object

            item['news_headline'] = news.css(
                'a.ia-card__title ::text').extract_first()
            item['newsInDetails'] = news.css(
                'p.ia-car-summary  ::text').extract_first()
            item["data"] = ""
            item['news_link'] = ""
            item['image_url'] = ""
            item["published_timestamp"] = ""
            item["author"] = ""
            item["link"] = news.css(
                'a.ia-card__title ::attr(href)').extract_first()
            item["comments"] = ""
            item["views"] = ""
            item["moreDetails"] = ""
            item["datetime"] = ""
            item["telephone"] = news.css('strong a  ::text').extract_first().split(':')[
                1].rsplit()[0]
            item["sub_category"] = ""
            item["writer"] = ""
            item["img_src"] = ""

            items.append(item)
        yield {"data": items}

        for i in range(2, 277):
            next_page = "http://www.autolanka.com/cars/?page="
            next_page = next_page+str(i)
            yield scrapy.Request(next_page, callback=self.parse)
