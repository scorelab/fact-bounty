# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import Spider
from news_sites.items import adaDeraneItem
#from urllib.parse import urljoin
from scrapy.http import Request


class BizadaDeranaSpider(scrapy.Spider):
    name = "bizada"
    allowed_domains = ["adaderana.lk"]
    start_urls = ['http://bizenglish.adaderana.lk/category/top-news/', 'http://bizenglish.adaderana.lk/category/news-2/',
                  'http://bizenglish.adaderana.lk/category/analysis/', 'http://bizenglish.adaderana.lk/category/features/']

    def parse(self, response):
        items = []
        # panel panel-default panel-latestst
        i = 0
        for news in response.css('div.col-lg-12.business-summary'):
            news_headline = news.css(
                'div.summary-news h3 a ::text').extract_first()
            news_url = news.css(
                'div.summary-news h3 a ::attr(href)').extract_first()
            image_url = news.css(
                'div.summary-news div.col-lg-4.thumb-image a img ::attr(src)').extract_first()
            date_time = news.css(
                'div.summary-news div.col-lg-12.col-sm-12.comments-business span ::text').extract_first()

            item = adaDeraneItem()
            item['news_headline'] = news_headline
            item['date'] = date_time
            item['news_link'] = news_url
            item['image_url'] = image_url
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        if 'data' in item:
            yield {'data': items}
            # yield {"data": items}

        next_link = response.css(
            'ul.pager a[title*=next] ::attr(href)').extract_first()
        if next_link is not None:
            #next_url = urljoin(response.url, str(next_link))
            print("crawling " + next_link)
            yield scrapy.Request(next_link, callback=self.parse)

    def parse_1(self, response):
        path = response.css('div.news-text p ::text').extract()
        s = ' '.join(path)
        item = response.meta['item']
        item['newsInDetails'] = s
        yield item
