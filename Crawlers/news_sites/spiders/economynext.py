import scrapy
from scrapy.spiders import Spider
from news_sites.items import EconomyNextItem
from urllib.parse import urljoin
import datetime
from scrapy.http import Request
import re


class EconomyNextSpider(scrapy.Spider):
    name = "economynext"
    allowed_domains = ["economynext.com"]
    start_urls = ['http://www.economynext.com/Apparel-2--4-9.html',
                  'http://www.economynext.com/Construction_and_Real_Estate-2--4-10.html',
                  'http://www.economynext.com/General_Industry-2--4-11.html']

    def parse(self, response):
        items = []
        for news in response.css('div.related-block ul.article-array li#ban15'):
            # print(news_arr)
            item = EconomyNextItem()
            # append to items object
            item['news_headline'] = news.css('a ::text')[0].extract()
            item['datetime'] = news.css('a ::text')[1].extract().rstrip()
            news_url = "http://economynext.com/" + \
                news.css('a ::attr(href)')[0].extract()
            item['link'] = news_url
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        yield {"newsInDetails": items}

        next_page = response.css(
            'div.page-pager a.next ::attr(href)').extract_first()
        if next_page is not None:
            print(next_page)
            next_page = "http://economynext.com/"+str(next_page)
            yield scrapy.Request(next_page, callback=self.parse)

    def parse_1(self, response):
        data = response.css('div.shortcode-content p ::text').extract()
        texts = [i.strip() for i in data]
        new_texts = list(filter(None, texts))
        string = ' '.join(new_texts)
        item = response.meta['item']
        item['newsInDetails'] = string
        yield item
