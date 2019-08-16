#!/bin/bash
source venv/bin/activate
for crawler in $(scrapy list)
do
    scrapy crawl $crawler
done       
