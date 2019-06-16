# -*- coding: utf-8 -*-
import scrapy
import dateutil.parser as dparser

from news_sites.items import NewsSitesItem


class adaDeranaSpider(scrapy.Spider):
    name = "ada"
    allowed_domains = ["adaderana.lk"]
    start_urls = ['http://www.adaderana.lk/hot-news', 'http://www.adaderana.lk/sports-news',
                  'http://www.adaderana.lk/entertainment-news', 'http://www.adaderana.lk/technology-news']

    def parse(self, response):
        for news_url in response.css('.hidden-xs a::attr("href")').extract():
            yield response.follow(news_url, callback=self.parse_article)

    def parse_article(self, response):
        item = NewsSitesItem()

        item['author'] = 'http://www.adaderana.lk'
        item['title'] = response.css('h1::text').extract_first()
        date  = response.css('.news-datestamp::text').extract_first()
        if date is not None:
            date = date.replace("\r", "")
            date = date.replace("\t", "")
            date = date.replace("\n", "")
            date = dparser.parse(date,fuzzy=True)
            date = date.strftime("%d %B, %Y")

        item['date'] = date
        item['imageLink'] = response.css('.news-banner .img-responsive::attr(src)').extract_first()
        item['source'] = 'http://www.adaderana.lk'
        item['content'] = ' \n '.join(response.css('.news-content p::text').extract())

        yield item
