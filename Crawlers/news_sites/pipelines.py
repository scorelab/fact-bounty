# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
import dateutil.parser as dparser


class NewsSitesPipeline(object):
    def process_item(self, item, spider):
        # add vote columns with initialized value to 0
        item["approved_count"] = 0
        item["fake_count"] = 0
        item["mixedvote_count"] = 0

        # change date format to allow elasticsearch to detect it as date column
        date = dparser.parse(item["date"]).date()
        item["date"] = date.isoformat()

        return item
