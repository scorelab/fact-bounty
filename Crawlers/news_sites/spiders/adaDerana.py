# -*- coding: utf-8 -*-
from scrapy.http import Request
from news_sites.items import defaultItem
from scrapy.spiders import Spider
import scrapy
try:
    from urllib.parse import urljoin
except ImportError:
    from urlparse import urljoin


class adaDeranaSpider(scrapy.Spider):
    name = "ada"
    allowed_domains = ["adaderana.lk"]
    start_urls = ['http://www.adaderana.lk/hot-news', 'http://www.adaderana.lk/sports-news',
                  'http://www.adaderana.lk/entertainment-news', 'http://www.adaderana.lk/technology-news']

    def parse(self, response):
        items = []
        # panel panel-default panel-latestst
        i = 0
        for news in response.css('div.sports'):
            news_headline = news.css(
                'div.story-text h4 a ::text').extract_first()
            news_url = news.css(
                'div.story-text h4 a ::attr(href)').extract_first()
            image_url = news.css(
                'div.col-xs-3.thumb-image a img ::attr(src)').extract_first()
            date_time = news.css(
                'div.col-xs-12.comments span ::text').extract_first()

            item = defaultItem()
            item['news_headline'] = news_headline
            item['newsInDetails'] = ""
            item["data"] = ""
            item['news_link'] = news_url
            item['image_url'] = image_url
            item["published_timestamp"] = ""
            item["author"] = ""
            item["link"] = ""
            item["comments"] = ""
            item["views"] = ""
            item["moreDetails"] = ""
            item["datetime"] = date_time
            item["telephone"] = ""
            item["sub_category"] = ""
            item["writer"] = ""
            item["img_src"] = ""

            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        yield {'data': items}
        # yield {"data": items}

        # No next page

    def parse_1(self, response):
        path = response.css('div.newsContent p ::text').extract()
        s = ' '.join(path)
        item = response.meta['item']
        item['newsInDetails'] = s
        yield item
