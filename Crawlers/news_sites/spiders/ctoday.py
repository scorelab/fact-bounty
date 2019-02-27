# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import Spider
from news_sites.items import CTItem
from urllib.parse import urljoin
from scrapy.http import Request


class CtodaySpider(scrapy.Spider):
    name = "ctoday"
    allowed_domains = ["ceylontoday.lk"]
    start_urls = ['http://www.ceylontoday.lk/category.php?id=1']

    def parse(self, response):
        items = []
        # panel panel-default panel-latestst
        i = 0
        for news in response.css('div.article-big'):
            title = news.css(
                'div.article-content h2 ::attr(title)').extract_first()
            tmpurl = news.css(
                'div.article-content h2 ::attr(href)').extract_first()
            url = 'http://www.ceylontoday.lk/'+tmpurl

            item = CTItem()
            item['news_headline'] = title
            item['link'] = url
            r = Request(url=url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        yield {"data": items}

        next_urls = response.css(
            'div.block-content div.pagination div.pagination ::attr(href)').extract()
        tmp_next = next_urls[len(next_urls) - 1]
        real_next = 'http://www.ceylontoday.lk/'+tmp_next
        yield scrapy.Request(real_next, callback=self.parse)

    def parse_1(self, response):
        path = response.css('div.shortcode-content')
        path = path.css('::text').extract()
        path = [i.strip() for i in path]
        path = list(filter(None, path))
        s = ' '.join(path)
        item = response.meta['item']
        item['data'] = s
        yield item
