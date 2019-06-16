# -*- coding: utf-8 -*-
import scrapy
import dateutil.parser as dparser

from ..items import NewsSitesItem


class slgurdianSpider(scrapy.Spider):
    name = "slg"
    allowed_domains = ["srilankaguardian.org"]
    start_urls = ["http://www.srilankaguardian.org/search"]

    def parse(self, response):
        # extract news urls from news section
        temp = response.css('.entry-title a::attr(href)').extract()

        # remove duplicate urls
        news_urls = []
        [news_urls.append(x) for x in temp if x not in news_urls]

        for news_url in news_urls:
            yield response.follow(news_url, callback=self.parse_article)

        next_page = response.css('blog-pager-older-link::attr(href)').extract_first()
        
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse_page)


    def parse_page(self, response):
        
        # extract news urls from news section
        temp = response.css('.entry-title a::attr(href)').extract()

        # remove duplicate urls
        news_urls = []
        [news_urls.append(x) for x in temp if x not in news_urls]

        for news_url in news_urls:
            yield response.follow(news_url, callback=self.parse_article)

        next_page = response.css('.fa-angle-double-right').xpath('../@href').extract_first()
        
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse_page)
    def parse_article(self, response):
        item = NewsSitesItem()

        item['author'] = response.css('.entry-content div div b::text').extract_first()
        item['title'] = response.css('.entry-title::text').extract_first()
        date  = response.css('.published::text').extract_first()
        if date is not None:
            date = dparser.parse(date,fuzzy=True)
            date = date.strftime("%d %B, %Y")
        item['date'] = date
        item['imageLink'] = response.css('#Blog1 img::attr(src)').extract_first()
        item['source'] = 'http://www.srilankaguardian.org'
        item['content'] = ' \n '.join(response.css('.entry-content div::text').extract())

        yield item
