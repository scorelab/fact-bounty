import scrapy
import dateutil.parser as dparser

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

        author = response.css('.artical-new-byline::text').extract_first()
        title = response.css('.artical-hd-out::text').extract_first()
        item['author'] = " ".join(author.split())
        item['title'] = " ".join(title.split())
        if response.css('.artical-new-byline::text').extract() and response.css('.artical-new-byline::text').extract()[1]:
            date = response.css('.artical-new-byline::text').extract()[1]
            date = dparser.parse(date,fuzzy=True)
            date = date.strftime("%d %B, %Y")
            item['date'] = date
        else:
            item['date'] = None
        item['imageLink'] = response.css('.main-news-block-artical .img-responsive::attr(src)').extract_first()
        item['source'] = 'https://www.newsfirst.lk'
        item['content'] = '\n'.join(response.css('.editor-styles p::text').extract())

        yield item
