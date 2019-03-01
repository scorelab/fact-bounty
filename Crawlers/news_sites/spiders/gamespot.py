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


class GameSpotSpider(scrapy.Spider):
    name = "gamespot"
    allowed_domains = ["gamespot.com"]
    start_urls = ['https://www.gamespot.com/reviews/']

    def parse(self, response):
        items = []
        for news in response.css('article.media.media-game.media-game'):
            # print(news_arr)
            item = defaultItem()
            # append to items object
            item['news_headline'] = news.css(
                'h3.media-title ::text').extract_first()
            item['datetime'] = news.css(
                'time.media-date ::attr(datetime)').extract_first()
            news_url = "https://www.gamespot.com" + \
                news.css('a.js-event-tracking ::attr(href)').extract_first()
            item['link'] = news_url

            item['newsInDetails'] = ""
            item["data"] = ""
            item['news_link'] = news_url
            item['image_url'] = ""
            item["published_timestamp"] = ""
            item["author"] = ""

            item["comments"] = ""
            item["views"] = ""
            item["moreDetails"] = ""

            item["telephone"] = ""
            item["sub_category"] = ""
            item["writer"] = ""
            item["img_src"] = ""
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        yield {"newsInDetails": items}

        next_page = "https://www.gamespot.com" + \
            response.css(
                'ul.paginate li.paginate__item.skip.next a.btn ::attr(href)').extract_first()
        if next_page is not None:
            print(next_page)
            next_page = str(next_page)
            yield scrapy.Request(next_page, callback=self.parse)

    def parse_1(self, response):
        data = response.css('div.js-content-entity-body p ::text').extract()
        texts = [i.strip() for i in data]
        new_texts = list(filter(None, texts))
        string = ' '.join(new_texts)
        item = response.meta['item']
        item['newsInDetails'] = string
        yield item
