import scrapy
from scrapy.spiders import Spider
from news_sites.items import RoarItem
from urllib.parse import urljoin
import datetime
from scrapy.http import Request


class RoarSpider(scrapy.Spider):
    name = "roartech"
    allowed_domains = ["roar.tech"]
    start_urls = ['http://roar.tech/insights/']

    def parse(self, response):
        items = []
        for news in response.css('div.article-card'):
            news_data = news.css('::text').extract()
            news_url = news.css('::attr(href)').extract_first()
            imgs = news.css(
                'img.article-featured-image.wp-post-image ::attr(src)').extract_first()

            news_data = [i.strip() for i in news_data]
            news_data = list(filter(None, news_data))

            item = RoarItem()
            item['news_headline'] = news_data[1]
            item['imgURL'] = imgs
            item['news_link'] = news_url
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
        yield {'data': items}

        '''
        next_link = response.xpath('/html/body/div[2]/div/div[1]/div[2]/div/div[1]/div[1]/div[2]/a[4]')
        next_link = next_link.css('::attr(href)').extract()
        next_link = next_link[0] # extract_first()
        if next_link is not None:
            next_url = urljoin(response.url, str(next_link))
            print("scrpping "+next_url)
            yield scrapy.Request(next_url, callback=self.parse)
        '''

    def parse_1(self, response):
        data = response.css('div.wrap.cf.inner-wrap ::text').extract()

        texts = [i.strip() for i in data]
        texts = list(filter(None, data))
        pub_date = texts[3]
        writer = texts[4]
        texts.pop(0)
        texts.pop(1)
        texts.pop(2)
        texts.pop(3)
        texts.pop(4)
        texts.pop(5)
        tmp = []
        i = 0
        while i < len(texts):
            tmp.append(str(texts[i]))
            i += 1
            if texts[i] == "How do you feel about this story?":
                break

        string = ' '.join(tmp)
        item = response.meta['item']
        item['newsInDetails'] = string
        item['date'] = pub_date
        yield item
