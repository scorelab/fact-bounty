import scrapy

from ..items import NewsSitesItem


class RAWSpider(scrapy.Spider):
    name = "raw"
    allowed_domains = ["raw.lk"]
    start_urls = ["http://www.raw.lk/news", "http://www.raw.lk/foreign_news",
                  "http://www.raw.lk/sports", "http://www.raw.lk/investigation"
    ]
    data = True

    def parse(self, response):
        news_urls = response.css('.cat-zero')
        if news_urls is None or len(news_urls) == 0:
            self.data = False
            return
        
        for news_url in news_urls:
            url = news_url.css('.cat-header::attr(href)').extract_first()
            img_url = news_url.css('.img-responsive::attr(src)').extract_first()
            yield response.follow(url, callback=self.parse_article, meta={'img_url': img_url})
        
        myurl = response.request.url
        category = myurl.split("/")[3]
        i = 0
        while True:
            i += 15
            next_url = "http://www.raw.lk/" + category + "/" + str(i)
            yield scrapy.Request(next_url, callback=self.parse)
            if self.data is False:
                break


    def parse_article(self, response):
        item = NewsSitesItem()

        item['author'] = 'raw'
        item['title'] = response.css('.inner-header::text').extract_first()
        item['date']  = response.css('.inner-other::text').extract_first()
        item['imageLink'] = response.meta.get('img_url')
        item['source'] = 'http://www.raw.lk'
        item['content'] = ' \n '.join(response.css('.inner-ft-text p::text').extract())

        yield item
