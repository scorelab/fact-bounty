import scrapy
from ..items import NewsSitesItem


class FtSpider(scrapy.Spider):
    name = "ft"
    allowed_domains = ["ft.lk"]
    start_urls = ['http://www.ft.lk']

    def parse(self, response):
        temp = response.css('.bottom-text::attr(href)').extract()

        # remove duplicate categories
        categories = [] 
        [categories.append(x) for x in temp if x not in categories]

        for category in categories:
            yield response.follow(category, callback=self.parse_category)
    
    def parse_category(self, response):
        # extract all news articles urls
        temp = response.css('.cat-header').xpath('../@href').extract()
        
        # remove duplicates
        news_urls = [] 
        [news_urls.append(x) for x in temp if x not in news_urls]

        # crawl article from each news page
        for news_url in news_urls:
            yield response.follow(news_url, callback=self.parse_article)
        
        # proceed to next page
        next_page = response.css('.active+ li a::attr(href)').extract_first()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)
    
    def parse_article(self, response):
        item = NewsSitesItem()

        item['author'] = 'FT'
        item['title'] = response.css('.inner-header::text').extract_first()
        date  = response.css('.inner-ft-text img::text').extract_first()
        if date is not None:
            item['date'] = date.split('/')[-1]
        else:
            item['date'] = None
        item['imageLink'] = response.css('.article-photo .set-image-border::attr(src)').extract_first()
        item['source'] = 'http://ft.lk/'
        item['content'] = ' \n '.join(response.css('.inner-ft-text p::text').extract())

        yield item
