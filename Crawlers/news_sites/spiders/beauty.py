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


class BeautySpider(scrapy.Spider):
    name = "beautifulu"
    allowed_domains = ["beautifulu.lk"]
    start_urls = ['http://beautifulu.lk/beauty-all/']

    def parse(self, response):
        items = []
        for news in response.css('div.small-12.medium-4.large-4.columns'):
            # print(news_arr)
            item = defaultItem()
            # append to items object

            news_url = news.css(
                'header.post-title.entry-header h5 a ::attr(href)').extract_first()

            item['news_headline'] = news.css(
                'header.post-title.entry-header h5 ::text').extract_first()
            item['newsInDetails'] = ""
            item["data"] = ""
            item['news_link'] = ""
            item['image_url'] = ""
            item["published_timestamp"] = ""
            item["author"] = ""
            item["link"] = news_url
            item["comments"] = ""
            item["views"] = ""
            item["moreDetails"] = ""
            item["datetime"] = news.css(
                'aside.post-author.cf time ::text').extract_first()
            item["telephone"] = ""
            item["sub_category"] = ""
            item["writer"] = ""
            item["img_src"] = ""

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
