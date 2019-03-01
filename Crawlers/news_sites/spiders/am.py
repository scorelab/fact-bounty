# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import Spider
from news_sites.items import defaultItem
try:
    from urllib.parse import urljoin
except ImportError:
    from urlparse import urljoin


from scrapy.http import Request


class amSpider(scrapy.Spider):
    name = "am"
    allowed_domains = ["am.lk"]
    start_urls = ['http://am.lk/local-news', 'http://am.lk/si-international',
                  'http://am.lk/si-economy', 'http://am.lk/sports']

    def parse(self, response):
        items = []
        i = 0
        for news in response.css('div.itemContainer'):
            news_headline = news.css(
                'div.catItemHeader h3.catItemTitle a ::text').extract_first()
            image = news.css(
                'div.catitemimageblock span.catitemimage a img ::attr(src)').extract_first()
            news_url = news.css(
                'div.catItemHeader h3.catItemTitle a ::attr(href)').extract_first()
            published_date = news.css(
                'div.catItemMetaInfo span.catItemDateCreated ::text').extract_first()
            data = news.css(
                'div.catItemBody div.catItemIntroText p ::text').extract()
            string_of_data = ' '.join(data)

            item = defaultItem()

            item['news_headline'] = news_headline
            item['newsInDetails'] = string_of_data
            item["data"] = ""
            item['news_link'] = news_url
            item['image_url'] = image
            item["published_timestamp"] = ""
            item["author"] = ""
            item["link"] = ""
            item["comments"] = ""
            item["views"] = ""
            item["moreDetails"] = ""
            item["datetime"] = published_date
            item["telephone"] = ""
            item["sub_category"] = ""
            item["writer"] = ""
            item["img_src"] = ""

            items.append(item)
        yield {'data': items}

        next_link = response.css(
            'div.k2Pagination ul.pagination li.next ::attr(href)').extract_first()
        next_link = "http://am.lk" + next_link
        yield scrapy.Request(next_link, callback=self.parse)
