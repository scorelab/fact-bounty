import scrapy
from ..items import NewsSitesItem


class NewsFirstSpider(scrapy.Spider):
    name = "nf"
    allowed_domains = ["newsfirst.lk"]
    start_urls = ['https://www.newsfirst.lk/category/life/', 'https://www.newsfirst.lk/category/business/',
                  'https://www.newsfirst.lk/category/sports/', 'https://www.newsfirst.lk/category/world/',
                  'https://www.newsfirst.lk/category/local/'
    ]
    
    def parse(self, response):
        # extract news urls from news section
        temp = response.css('.news-lf-section a::attr(href)').extract()

        # remove duplicate urls
        news_urls = []
        [news_urls.append(x) for x in temp if x not in news_urls]

        # remove
        if '#' in news_urls:
            news_urls.remove('#')

        for news_url in news_urls:
            yield response.follow(news_url, callback=self.parse_article)

        next_page = response.css('.next::attr(href)').extract_first()
        if next_page is not None:
            yield response.follow(next_page, callback=self.parse)


    def parse_article(self, response):
        item = NewsSitesItem()

        item['author'] = response.css('.artical-new-byline::text').extract_first()
        item['title'] = response.css('.artical-hd-out::text').extract_first()
        if response.css('.artical-new-byline::text').extract() and response.css('.artical-new-byline::text').extract()[1]:
            item['date']  = response.css('.artical-new-byline::text').extract()[1]
        item['imageLink'] = response.css('.main-news-block-artical .img-responsive::attr(src)').extract_first()
        item['source'] = 'https://www.newsfirst.lk'
        item['content'] = ' \n '.join(response.css('.editor-styles p::text').extract())

        yield item
