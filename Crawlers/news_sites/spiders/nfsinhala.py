import scrapy
import dateutil.parser as dparser

from ..items import NewsSitesItem


class NewsFirstSinhalaSpider(scrapy.Spider):
    name = "nfsl"
    allowed_domains = ["newsfirst.lk"]
    start_urls = ['https://www.newsfirst.lk/sinhala/category/local/']


    def __init__(self, date=None):
        if date is not None:
            self.dateToMatch = dparser.parse(date,fuzzy=True).date()
        else:
            self.dateToMatch = None

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

        ##next_page = response.css('.next::attr(href)').extract_first()
        ##if next_page is not None:
            ##yield response.follow(next_page, callback=self.parse)


    def parse_article(self, response):
        item = NewsSitesItem()

        author = response.css('.artical-new-byline::text').extract_first()
        title = response.css('.artical-hd-out::text').extract_first()
        item['author'] = " ".join(author.split())
        item['title'] = " ".join(title.split())
        if response.css('.artical-new-byline::text').extract() and response.css('.artical-new-byline::text').extract()[1]:
            date = response.css('.artical-new-byline::text').extract()[1]
            date = dparser.parse(date,fuzzy=True).date()
            # don't add news if we are using dateToMatch and date of news
            if self.dateToMatch is not None and self.dateToMatch != date:
                return
            item['date'] = date.strftime("%d %B, %Y")
        else:
            return
        item['imageLink'] = response.css('.main-news-block-artical .img-responsive::attr(src)').extract_first()
        item['source'] = 'https://www.newsfirst.lk/sinhala'

        yield item
