import scrapy
from ..items import NewsSitesItem


class EconomyNextSpider(scrapy.Spider):
    name = "economynext"
    allowed_domains = ["economynext.com"]
    start_urls = ['http://www.economynext.com/']

    def parse(self, response):
        categories = response.css('.sub-menu div:nth-child(1) a::attr(href)').extract()
        for category in categories:
            yield response.follow(category, callback=self.parse_category)
    
    def parse_category(self, response):
        # extract all news articles urls
        temp = response.css('.related-block a:nth-child(1)::attr(href)').extract()

        # remove duplicates
        news_urls = []
        [news_urls.append(x) for x in temp if x not in news_urls]

        # crawl article from each news page
        for news_url in news_urls:
            yield response.follow(news_url, callback=self.parse_article)
        
        # proceed to next page
        next_page = response.css('.next::attr(href)').extract_first()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)

    def parse_article(self, response):
        item = NewsSitesItem()

        item['author'] = 'EconomyNext'
        item['title'] = response.css('.article-title::text').extract_first()
        date  = response.css('.article-title+ h2::text').extract_first()
        if date is not None:
            item['date'] = date.split('|')[0]
        else:
            item['date'] = None
        item['imageLink'] = response.css('.article-photo .set-image-border::attr(src)').extract_first()
        item['source'] = 'https://economynext.com/'
        item['content'] = response.css('p::text').extract_first()

        yield item
