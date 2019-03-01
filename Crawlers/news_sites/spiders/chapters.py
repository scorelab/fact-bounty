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


class ChaptersSpider(scrapy.Spider):
    name = "chapters"
    allowed_domains = ["chapters.lk"]
    start_urls = [
        'https://chapters.lk/index.php?route=product/category&path=60_75']

    def parse(self, response):
        items = []
        for news in response.css('div.name'):
            # print(news_arr)
            item = defaultItem()
            # append to items object
            item['news_headline'] = news.css('::text').extract_first()
            news_url = news.css('a ::attr(href)').extract_first()
            item['link'] = news_url

            item['newsInDetails'] = ""
            item["data"] = ""
            item['news_link'] = ""
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
