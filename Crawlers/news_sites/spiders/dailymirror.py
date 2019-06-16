import scrapy
import dateutil.parser as dparser

from ..items import NewsSitesItem


class DailymirrorSpider(scrapy.Spider):
    name = "dailymirror"
    start_urls = ['http://www.dailymirror.lk/']

    def parse(self, response):
        categories = response.xpath('//*[contains(concat( " ", @class, " " ), concat( " ", "hrbo", " " ))]')
        categories = categories.xpath('../@href').extract()
        for category in categories:
            try:
                int(category.split('/')[-1])
            except ValueError:
                continue
            
            yield response.follow(category, callback=self.parse_category)
    
    def parse_category(self, response):
        news_urls = response.css('.cat-hd-tx')
        news_urls = news_urls.xpath('../@href').extract()
        for news_url in news_urls:
            yield response.follow(news_url, callback=self.parse_article)
        
        next_page = response.css('.page-numbers::attr("href")').extract_first()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse_category)

    def parse_article(self, response):
        item = NewsSitesItem()

        author = response.css('strong::text').extract_first().replace('(', '').replace(')', '')
        item['author'] = author
        item['title'] = response.css('.innerheader::text').extract_first()
        # extract date component and generalize it
        date  = response.css('.col-12 .gtime::text').extract_first()
        if date is not None:
            date = dparser.parse(date,fuzzy=True)
            date = date.strftime("%d %B, %Y")
        item['date'] = date
        item['imageLink'] = None
        item['source'] = 'http://www.dailymirror.lk'
        item['content'] = '\n'.join(response.css('.inner-content p::text').extract())

        yield item
