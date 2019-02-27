import scrapy
from scrapy.spiders import Spider
from news_sites.items import PulseItem
from urllib.parse import urljoin
import datetime
from scrapy.http import Request


class PulseSpider(scrapy.Spider):
    name = "pulse"
    allowed_domains = ["pulse.lk"]
    start_urls = ['http://www.pulse.lk/category/fashion/']

    def parse(self, response):
        items = []
        for news in response.css('div.blog-content-wrapper'):
            news_data = news.css('::text').extract()
            news_url = news.css(
                'h3.gdlr-blog-title ::attr(href)').extract_first()
            news_data = [i.strip() for i in news_data]
            news_data = list(filter(None, news_data))

            item = PulseItem()
            item['news_headline'] = news_data[0]
            item['date'] = news_data[2]
            item['comment'] = news_data[6]
            item['news_link'] = news_url
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
        yield {'data': items}
        next_link = response.xpath(
            '/html/body/div[2]/div/div[1]/div[2]/div/div[1]/div[1]/div[2]/a[4]')
        next_link = next_link.css('::attr(href)').extract()
        next_link = next_link[0]  # extract_first()
        if next_link is not None:
            next_url = urljoin(response.url, str(next_link))
            print("scrpping "+next_url)
            yield scrapy.Request(next_url, callback=self.parse)

    def parse_1(self, response):
        data = response.css('div.gdlr-blog-content ::text').extract()
        texts = [i.strip() for i in data]
        string = ' '.join(texts)
        item = response.meta['item']
        item['newsInDetails'] = string
        yield item
