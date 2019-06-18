from flask import Blueprint
from .controller import crawlerController

blueprint = Blueprint('crawler', __name__)


blueprint.add_url_rule(
    '/cron_job',
    view_func=crawlerController['setcronjob'],
    methods=['GET', 'POST', 'PUT', 'DELETE']
)

blueprint.add_url_rule(
    '/crawl_live',
    view_func=crawlerController['crawlbydate'],
    methods=['POST']
)
