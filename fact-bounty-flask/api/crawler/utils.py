from scrapyd_api import ScrapydAPI
from flask import jsonify, current_app


def cron_crawlers():
    scrapyd = current_app.scrapy

    spiders = scrapyd.list_spiders('default')

    tasks = []
    for spider in spiders:
        tasks.append(scrapyd.schedule('default', spider))
    
    return jsonify({'tasks_data': tasks, 'status': 'started' })
