import scrapy
from scrapy.spiders import Spider
from news_sites.items import NFItem
from urllib.parse import urljoin
# import datetime
from scrapy.http import Request


class NewsFirstSpider(scrapy.Spider):
    name = "nf"
    allowed_domains = ["newsfirst.lk"]
    start_urls = ['http://newsfirst.lk/english/category/local']

    def parse(self, response):
        items = []
        # today = datetime.datetime.now().strftime("%Y-%m-%d") # get current date
        for news in response.css('div.post-news'):
            title = news.css(
                'div.post_title h3 a.title ::attr(title)').extract_first()
            img = news.css(
                'div.image_review_wrapper a img.image_over ::attr(src)').extract_first()
            news_url = news.css(
                'div.post_title h3 a.title ::attr(href)').extract_first()
            meta_user = news.css(
                'div.post_title p.post-meta span.meta-user a ::text').extract_first()
            meta_date = news.css(
                'div.post_title p.post-meta span.date ::text').extract_first()

            item = NFItem()
            item['news_headline'] = title
            item['published_timestamp'] = meta_date
            item['author'] = meta_user
            item['imgURL'] = img
            item['link'] = news_url
            r = Request(url=news_url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        if 'data' in item:
            yield {'data': items}

        for i in range(1, 2528):
            next_url = "http://newsfirst.lk/english/category/local/page/" + \
                str(i)
            yield scrapy.Request(next_url, callback=self.parse)

    def parse_1(self, response):
        path = response.css('#post-content')
        path = path.css('p::text').extract()
        path = [i.strip() for i in path]
        path = list(filter(None, path))
        s = ' '.join(path)
        item = response.meta['item']
        item['data'] = s
        yield item
