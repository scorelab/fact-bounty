import scrapy
from scrapy.spiders import Spider
from news_sites.items import FtItem
from urllib.parse import urljoin
# import datetime
from scrapy.http import Request


class FitSpider(scrapy.Spider):
    name = "fit"
    allowed_domains = ["ft.lk"]
    start_urls = ['http://www.ft.lk/it-telecom-tech']
    # 'http://www.ft.lk/it-telecom-tech','http://www.ft.lk/travel-tourism','http://www.ft.lk/financial-services','http://www.ft.lk/agriculture','http://www.ft.lk/entertainment-sectors','http://www.ft.lk/fashionlifestyle','http://www.ft.lk/energy','http://www.ft.lk/international','http://www.ft.lk/management']

    def parse(self, response):
        items = []
        # today = datetime.datetime.now().strftime("%Y-%m-%d") # get current date
        for news in response.css('div.row.cat-zero'):
            # newss = news.css('h2#ban9 a ::text').extract_first()
            newsDataWithErrors = news.css('::text').extract()
            url = news.css('::attr(href)').extract_first()
            filterErrors = [i.strip() for i in newsDataWithErrors]
            NewsData = list(filter(None, filterErrors))
            item = FtItem()
            item['news_headline'] = NewsData[0]
            item['date'] = NewsData[1]
            # item['newsDetails']=NewsData[2]
            item['news_link'] = url
            r = Request(url=url, callback=self.parse_1)
            r.meta['item'] = item
            yield r
            items.append(item)
        yield {'data': items}

        for i in range(20, 11660, 20):
            next_url = "http://www.ft.lk/news/"+str(i)
            yield scrapy.Request(next_url, callback=self.parse)

        '''
        next_link = response.xpath('/html/body/div[4]/div/div[1]/div/ul/li[5]')
        next_link = next_link.css('a ::attr(href)').extract()
        next_link = next_link[0] # extract_first()
        if next_link is not None:
            next_url = urljoin(response.url, str(next_link))
            print("scrpping "+next_url)
            yield scrapy.Request(next_url, callback=self.parse)
        '''

    def parse_1(self, response):
        path = response.css('div.row.inner-ft-text')
        path = path.css('p::text').extract()
        path = [i.strip() for i in path]
        path = list(filter(None, path))
        s = ' '.join(path)
        item = response.meta['item']
        item['data'] = s
        yield item
