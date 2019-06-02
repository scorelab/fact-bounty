# -*- coding: utf-8 -*-
import scrapy

from ..items import NewsSitesItem


class ReporterSpider(scrapy.Spider):
    name = "reporter"
    allowed_domains = ["reporter.lk"]
    start_urls = ['http://www.reporter.lk/']

    def parse(self, response):
        categories = response.css('#Label2 a::attr(href)').extract()
        for category in categories:
            yield response.follow(category, callback=self.parse_category)
    
    def parse_category(self, response):
        # extract all news articles urls
        temp = response.css('.entry-title a::attr(href)').extract()

        # remove duplicates
        news_urls = [] 
        [news_urls.append(x) for x in temp if x not in news_urls]

        # crawl article from each news page
        for news_url in news_urls:
            yield response.follow(news_url, callback=self.parse_article)
        
        # proceed to next page
        # .fa-angle-double-right
        next_page = response.css('.fa-angle-double-right')
        next_page = response.xpath('../@href').extract_first();        
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)
    
    def parse_article(self, response):
        item = NewsSitesItem()

        item['author'] = 'http://www.reporter.lk/'
        item['title'] = response.css('.entry-title::text').extract_first()
        item['date']  = response.css('.timeago::text').extract_first()
        item['imageLink'] = response.css('#Blog1 img::attr(src)').extract_first()
        item['source'] = 'http://www.reporter.lk/'
        item['content'] = ' \n '.join(response.css('.entry-content::text').extract())

        yield item
