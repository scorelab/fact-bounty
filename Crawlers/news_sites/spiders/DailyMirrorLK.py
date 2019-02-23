# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import Spider
from news_sites.items import DailyMirrorItem
from urllib.parse import urljoin
from scrapy.http import Request


class DailymirrorlkSpider(scrapy.Spider):
    name = "DailyMirror"
    allowed_domains = ["dailymirror.lk"]
    # start_urls = ['http://www.dailymirror.lk/news']
    # 'http://www.dailymirror.lk/news'
    start_urls = ['http://www.dailymirror.lk/financial-news']
    # , 'http://www.dailymirror.lk/financial-news', 'http://www.dailymirror.lk/other']

    def parse(self, response):
        items = []
        # panel panel-default panel-latestst
        i = 0
        for news in response.css('div.media'):
            latest_news = news.css('::text').extract()
            news_url = news.css(
                'h2.media-heading.cat-header ::attr(href)').extract_first()
            newss = latest_news
            newss = [i.strip() for i in newss]
            obj = list(filter(None, newss))
            # print(news_urls)
            item = DailyMirrorItem()
            item['news_headline'] = obj[0]
            item['published_timestamp'] = obj[1]
            item['comments'] = obj[2]
            item['views'] = obj[3]
            #item['moreDetails'] = obj[4]
            item['link'] = news_url
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        if 'data' in item:
            yield {'data': items}
            # yield {"data": items}

        for i in range(30, 1890, 30):
            next_url = "http://www.dailymirror.lk/financial-news/"+str(i)
            yield scrapy.Request(next_url, callback=self.parse)

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
        path = response.css('div.row.inner-text')
        path = path.css('::text').extract()
        path = [i.strip() for i in path]
        path = list(filter(None, path))
        # s=''
        tmp = []
        i = 0
        while i < len(path):
            # s=s.join(str(path[i]))
            tmp.append(str(path[i]))
            i += 1
            if path[i] == 'Recommended Articles':
                break
        s = ' '.join(tmp)
        item = response.meta['item']
        item['data'] = s
        yield item
