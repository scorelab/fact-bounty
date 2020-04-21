import scrapy
import dateutil.parser as dparser

from ..items import NewsSitesItem


class RAWSpider(scrapy.Spider):
    name = "raw"
    allowed_domains = ["raw.lk"]
    start_urls = [
        "http://www.raw.lk/news",
        "http://www.raw.lk/foreign_news",
        "http://www.raw.lk/sports",
        "http://www.raw.lk/investigation",
    ]
    data = True

    def __init__(self, date=None, *args, **kwargs):
        super(RAWSpider, self).__init__(*args, **kwargs)

        if date is not None:
            self.dateToMatch = dparser.parse(date, fuzzy=True).date()
        else:
            self.dateToMatch = None

    def parse(self, response):
        # fetch news urls from each page
        news_urls = response.css(".cat-zero")

        # if no news_urls are present on this page, i.e. we have proceed ahead of limited pages,
        # then break the loop
        if news_urls is None or len(news_urls) == 0:
            self.data = False
            return

        # iterate in news_urls
        for news_url in news_urls:
            # fetch url to main news page
            url = news_url.css(".cat-header").xpath("../@href").extract_first()

            # fetch image url from main page as no image is present in article
            img_url = news_url.css(
                ".img-responsive::attr(src)"
            ).extract_first()

            # follow the url of news article and fetch news data from it
            yield response.follow(
                url, callback=self.parse_article, meta={"img_url": img_url}
            )

        # mechanism to follow next page
        myurl = response.request.url
        category = myurl.split("/")[3]
        i = 0
        while True:
            i += 15
            next_url = "http://www.raw.lk/" + category + "/" + str(i)
            yield scrapy.Request(next_url, callback=self.parse)
            if self.data is False:
                break

    # fetch data from news article and create news item from it
    def parse_article(self, response):
        item = NewsSitesItem()

        item["author"] = "raw"
        item["title"] = response.css(".inner-header::text").extract_first()
        date = response.css(".inner-other::text").extract_first()
        if date is None:
            return

        date = date.replace("\r", "")
        date = date.replace("\t", "")
        date = date.replace("\n", "")
        date = dparser.parse(date, fuzzy=True).date()

        # don't add news if we are using dateToMatch and date of news
        if self.dateToMatch is not None and self.dateToMatch != date:
            return

        item["date"] = date.strftime("%d %B, %Y")
        item["imageLink"] = response.meta.get("img_url")
        item["source"] = "http://www.raw.lk"
        item["content"] = "\n".join(
            response.css(".inner-ft-text p::text").extract()
        )
        item["news_url"] = response.url

        yield item
