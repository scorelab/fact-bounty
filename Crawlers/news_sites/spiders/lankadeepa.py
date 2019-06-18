# -*- coding: utf-8 -*-
import scrapy
import dateutil.parser as dparser

from ..items import NewsSitesItem


class LankadeepaSpider(scrapy.Spider):
    name = "lankadeepa"
    allowed_domains = ["lankadeepa.lk"]
    start_urls = ['http://www.lankadeepa.lk/latest_news/1']

    
    def __init__(self, date=None):
        if date is not None:
            self.dateToMatch = dparser.parse(date,fuzzy=True).date()
        else:
            self.dateToMatch = None

    def parse(self, response):

        # fetch news urls from each page
        news_urls = response.css('.simple-thumb')

        # iterate in news_urls
        for news_url in news_urls:
            # fetch url to main news page
            url = news_url.css('.news-title::attr("href")').extract_first()

            # fetch image url from main page as no image is present in article
            img_url = news_url.css('.thubs-img::attr(src)').extract_first()

            # follow the url of news article and fetch news data from it
            yield response.follow(url, callback=self.parse_article, meta={'img_url': img_url})

        next_page = response.css('.page-numbers::attr("href")').extract_first()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)

    def parse_article(self, response):
        item = NewsSitesItem()

        item['author'] = 'http://www.lankadeepa.lk'
        item['title'] = response.css('.post-title::text').extract_first()
        # extract date component and generalize it
        date  = response.css('.post-date::text').extract_first()
        if date is None:
            return
        
        date = date.replace("\r", "")
        date = date.replace("\t", "")
        date = date.replace("\n", "")
        date = dparser.parse(date,fuzzy=True).date()
        
        # don't add news if we are using dateToMatch and date of news 
        if self.dateToMatch is not None and self.dateToMatch != date:
            return

        item['date'] = date.strftime("%d %B, %Y")
        item['imageLink'] = response.meta.get('img_url')
        item['source'] = 'http://www.lankadeepa.lk'
        item['content'] = ' \n '.join(response.css('.post-content p::text').extract())

        yield item
