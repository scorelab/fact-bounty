#!/usr/bin/python3
# -*- coding: utf-8 -*-

"""
/#
 # =====================================================================================
 #
 #       Filename:  
 #
 #    Description:  
 #
 #        Version:  1.0.0
 #        Created:  Mon Oct 30 16:02:23 2017
 #       Revision:  none
 #       Compiler:  python3
 #
 #         Author:  lasithniro (c)
 #   Organization:  L2N Inc.
 #        Credits:  
 #
 # =====================================================================================
 #/
"""

import scrapy
from scrapy.spiders import Spider
from urllib.parse import urljoin
from scrapy.http import Request


class CitySpider(scrapy.Spider):
    name = "city"
    allowed_domains = ["fallingrain.com"]
    start_urls = ['http://www.fallingrain.com/world/CE/']

    def parse(self, response):
        items = []
        # panel panel-default panel-latestst
        i = 0
        prefix = "http://www.fallingrain.com"
        arr = []
        for news in response.css('ul ::attr(href)').extract():
            if(news != '/world/CE/00/'):
                arr.append(prefix+news)
            else:
                print("pass none")
        for i in arr:
            next_url = i
            yield scrapy.Request(next_url, callback=self.parse)

    def parse_1(self, response):
        prefix = "http://www.fallingrain.com"
        path = response.css('a ::attr(href)').extract()
        yield {"data": path}
        '''        
        urls = []
        for i in path:
            if(i.split('/')[5].isalpha()):
                urls.append(prefix+i)
        yield urls
        '''
