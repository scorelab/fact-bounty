import scrapy
from ..items import NewsSitesItem

class DailymirrorSpider(scrapy.Spider):
    name = "DailyMirror"
    start_urls = ['http://www.dailymirror.lk/']

    def parse(self, response):
        categories = response.xpath('//*[contains(concat( " ", @class, " " ), concat( " ", "hrbo", " " ))]')
        categories = categories.xpath('../@href')
        for category in categories:
            try:
                int(category.split('/')[-1])
            except ValueError:
                continue
            
            yield response.follow(category, callback=self.parse_category)
    
    def parse_category(self, response):
        for news_url in response.css('.cat-hd-tx::attr("href")').extract():
            yield response.follow(news_url, callback=self.parse_article)
        
        next_page = response.css('.page-numbers::attr("href")').extract_first()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)

    def parse_article(self, response):
        item = NewsSitesItem()

        item['author'] = 'DailyMirror'
        item['title'] = response.css('.innerheader::text').extract_first()
        item['date']  = response.css('.col-12 .gtime::text').extract()[1]
        item['imageLink'] = None
        item['source'] = 'http://www.dailymirror.lk'
        item['content'] = ' \n '.join(response.css('.inner-content p::text').extract())

        yield item
