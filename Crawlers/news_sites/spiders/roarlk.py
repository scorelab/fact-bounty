import scrapy
from scrapy.spiders import Spider
from news_sites.items import RoarItem
from urllib.parse import urljoin
import datetime
from scrapy.http import Request


class RoarSpider(scrapy.Spider):
    name = "roar"
    allowed_domains = ["roar.lk"]
    start_urls = ['https://roar.lk/category/economy/page/%d/' %
                  (n) for n in range(1, 5)]
    #start_urls = ['http://roar.lk/features/','http://roar.lk/reports/','http://roar.lk/category/economy/','http://roar.lk/category/editorial/','http://roar.lk/category/environment-wildlife/','http://roar.life/']

    def parse(self, response):
        items = []
        for news in response.css('div.article-card'):
            news_data = news.css('::attr(title)').extract_first()
            news_url = news.css('::attr(href)').extract_first()
            imgs = news.css(
                'img.article-featured-image-wrapper ::attr(src)').extract_first()

            item = RoarItem()
            item['news_headline'] = news_data
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
        tmp = []
        for s in texts:
            s = s.strip()
            if s == "How do you feel about this story?":
                break
            else:
                tmp.append(s)

        string = ' '.join(tmp)
        string = string.replace('\n', ' ')
        item = response.meta['item']
        item['newsInDetails'] = string
        item['date'] = pub_date
        yield item
