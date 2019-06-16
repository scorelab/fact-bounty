# -*- coding: utf-8 -*-
import scrapy
import json
import dateutil.parser as dparser

from ..items import NewsSitesItem


class CtodaySpider(scrapy.Spider):
    name = "ctoday"
    allowed_domains = ["ceylontoday.lk"]
    start_urls = ['http://www.ceylontoday.lk/news/8', 'http://www.ceylontoday.lk/news/5',
                  'http://www.ceylontoday.lk/news/14', 'http://www.ceylontoday.lk/news/7',
                  'http://www.ceylontoday.lk/news/4', 'http://www.ceylontoday.lk/news/6',
                  'http://www.ceylontoday.lk/news/2', 'http://www.ceylontoday.lk/news/15']
    
    # base url of api to extract single news article
    base_url = 'http://site-api.ceylontoday.lk/api/News/getSingleNews?Id='

    def parse(self, response):
        for news_url in response.css('.news-text-link::attr(href)').extract():
            news_id = news_url.split('/')
            if news_id is not None:
                news_id = news_id[-1]
                url = self.base_url + news_id

                yield response.follow(url, callback=self.parse_article)

        # next_page = response.css('').extract_first()
        # if next_page is not None:
        #     yield response.follow(next_page, callback=self.parse)


    def parse_article(self, response):
        jsonresponse = json.loads(response.body_as_unicode())
        news = jsonresponse['data'][0]

        item = NewsSitesItem()

        item['author'] = news['Author_Name']
        item['title'] = news['Title']
        # extract date component and generalize it
        date  = news['Publish_Date_String']
        if date is not None:
            date = dparser.parse(date,fuzzy=True)
            date = date.strftime("%d %B, %Y")
        item['date'] = date
        item['imageLink'] = news['Header_Image']
        item['source'] = response.url
        item['content'] = news['HTML_Content'].replace('<p>', '').replace('</p>', '\n')

        yield item
