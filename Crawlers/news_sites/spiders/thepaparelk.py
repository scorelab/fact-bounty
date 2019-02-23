# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import Spider
from news_sites.items import ThePapareItem
from urllib.parse import urljoin
from scrapy.http import Request


class ThePapareSpider(scrapy.Spider):
    name = "ThePapare"
    allowed_domains = ["thepapare.com"]
    start_urls = ['http://www.thepapare.com/latest-news']

    def parse(self, response):
        items = []
        for news in response.css('div.td-block-span12'):
            # data = news.css('meta ::attr(content)').extract()
            # yield(data[0])
            newsheadlineArr = news.css(
                'div.item-details h3.entry-title.td-module-title a ::attr(title)').extract_first()
            meta_data = news.css('meta ::attr(content)').extract()
            news_href = news.css(
                'div.item-details h3.entry-title.td-module-title a ::attr(href)').extract_first()
            print("********************************************")
            headline = newsheadlineArr
            news_link = news_href
            writer = meta_data[1]
            datetime = meta_data[2]
            img = meta_data[4]
            comments = meta_data[5]

            # assign tp item
            item = ThePapareItem()
            item['news_headline'] = headline
            item['news_link'] = news_link
            item['date'] = datetime
            item['writer'] = writer
            item['img_src'] = img
            item['comments'] = comments

            r = Request(url=news_link, callback=self.parse_1)
            r.meta['item'] = item
            yield r

            items.append(item)

        yield {"data": items}

    def parse_1(self, response):
        path = response.css('div.td-post-content p ::text').extract()
        path = [i.strip() for i in path]
        path = list(filter(None, path))

        s = " ".join(path)
        item = response.meta['item']
        item['newsInDetails'] = s
        yield item
