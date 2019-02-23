from urllib.parse import urljoin
import scrapy
from scrapy.spiders import Spider
from news_sites.items import NationlkItem
import datetime
from scrapy.http import Request


class NationLKSpider(scrapy.Spider):
    name = "nationlk"
    allowed_url = ["nation.lk"]
    # home contains all goods
    start_urls = ['http://nation.lk/online/pages/news/page/1']
    today = datetime.datetime.now().strftime("%Y-%m-%d")  # get current date

    def parse(self, response):
        items = []
        for itemNames in response.css('div.td_module_10.td_module_wrap.td-animation-stack.td_module_no_thumb'):
            item = NationlkItem()

            title = itemNames.css(
                'h3.entry-title.td-module-title ::text').extract_first()
            link = itemNames.css(
                'h3.entry-title.td-module-title ::attr(href)').extract_first()
            date = itemNames.css(
                'div.td-post-date ::attr(datetime)').extract_first()
            writer = itemNames.css(
                'div.td-post-author-name a ::text').extract_first()

            item['news_headline'] = title
            item['news_link'] = link
            item['date'] = date
            item['writer'] = writer
            r = Request(url=link, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        yield {"data": items}

        '''
        last = response.css('div.page-nav.td-pb-padding-side a.last ::text').extract_first()
        last = int(last)
        print("##############################")
        print(last)
        for i in range(2,last):
            next_url = "http://nation.lk/online/pages/news/page/"+str(i)
            yield scrapy.Request(next_url, callback=self.parse)

        '''
        a = response.css('div.page-nav.td-pb-padding-side')
        next_page = a.css('a ::attr(href)').extract()
        next_page = next_page[len(next_page)-1]
        if next_page is not None:
            next_url = urljoin(response.url, str(next_page))
            print("scrpping " + next_url)
            yield scrapy.Request(next_url, callback=self.parse)

    def parse_1(self, response):
        data = response.css(
            'div.td-post-content.td-pb-padding-side p ::text').extract()
        data = ' '.join(data)
        item = response.meta['item']
        item['newsInDetails'] = data
        yield item
