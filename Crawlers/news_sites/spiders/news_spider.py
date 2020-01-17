import scrapy

class NewsSpider(scrapy.Spider):
    name = "news"

    start_urls = ['https://eu.usatoday.com/']

    def parse(self, response):
        for href in response.css('.page-main-content-container a::attr(href)').extract():
            yield response.follow(href, self.parse_article)
            
    def parse_article(self, response):
        for article in response.css('.page-main-content-container'):
            yield {
                'title': article.css('.title::text').extract_first(),
                'author': article.css('.author::text').extract_first(),
                'date': article.css('.publish-date::text').extract_first(),
                'image-link': article.css('.image-image img::attr(src)').extract(),
                'content': article.css('.article-wrapper p::text').extract(),
            }