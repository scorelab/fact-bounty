import scrapy
from scrapy.http import Request

from ..items import NewsSitesItem


class RoarSpider(scrapy.Spider):
    name = "roar"
    allowed_domains = ["roar.lk"]
    start_urls = ['https://roar.media/english/life/', 'https://roar.media/english/tech/']
    def parse(self, response):
        # extract news urls from news section
        temp = response.css('.withGrid > a::attr(href)').extract()

        # remove duplicate urls
        news_urls = [] 
        [news_urls.append(x) for x in temp if x not in news_urls]
        
        for news_url in news_urls:
            yield response.follow(news_url, callback=self.parse_article)

        # next_page = response.css('.fa-angle-double-right').xpath('../@href').extract_first()
        # if next_page is not None:
        #     yield response.follow(next_page, callback=self.parse)


    def parse_article(self, response):
        item = NewsSitesItem()

        item['author'] = response.css('#articleAuthor::text').extract_first()
        item['title'] = response.css('.title::text').extract_first()
        item['date']  = response.css('#articleDate::text').extract_first()
        item['imageLink'] = None
        item['source'] = 'https://roar.media'
        item['content'] = ' \n '.join(response.css('#article-body h2 , .inner-article-body > p::text').extract())

        yield item
