# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import Spider
from news_sites.items import ReadMeItem
from urllib.parse import urljoin
from scrapy.http import Request


class DailymirrorlkSpider(scrapy.Spider):
    name = "readmelk"
    allowed_domains = ["readme.lk"]
    start_urls = ['http://www.readme.lk/category/news/']

    def parse(self, response):
        items = []
        # panel panel-default panel-latestst
        i = 0
        for news in response.css('div.article-panel.add-active.clearfix.category-231.col-md-3.grid-4'):
            latest_news = news.css('::text').extract()
            news_url = news.css('a.layer-link ::attr(href)').extract_first()
            newss = latest_news
            newss = [i.strip() for i in newss]
            obj = list(filter(None, newss))
            # print(news_urls)
            item = ReadMeItem()
            item['sub_category'] = obj[0]
            item['news_headline'] = obj[1]
            item['date'] = obj[2]
            item['writer'] = obj[4]
            #item['moreDetails'] = obj[4]
            item['news_link'] = news_url
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        yield {"data": items}

        '''
        next_link = response.xpath('/html/body/div[1]/div/div[7]/div[1]/ul/div/a[3]')
        next_link = next_link.css('::attr(href)').extract()
        next_link = next_link[0] # extract_first()
        if next_link is not None:
            next_url = urljoin(response.url, str(next_link))
            print("scrpping "+next_url)
            yield scrapy.Request(next_url, callback=self.parse)
        '''

    def parse_1(self, response):
        path = response.css('div.content-anchor-inner')
        path = path.css('::text').extract()
        path = [i.strip() for i in path]
        path = list(filter(None, path))
        path = path[11:]
        tmp = []
        for s in path:
            if (s == "README"):
                break
            else:
                tmp.append(s)
        s = ' '.join(tmp)
        item = response.meta['item']
        item['newsInDetails'] = s
        yield item
