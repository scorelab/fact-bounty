import os
import unittest
import tempfile
import json
import sys

sys.path.append(os.path.join(sys.path[0], "../../"))
FLASKR = __import__("fact-bounty-flask")


class Test_Crawler(unittest.TestCase):
    def setUp(self):
        FLASKR.config["SQLALCHEMY_DATABASE_URI"] = tempfile.mkstemp()
        FLASKR.testing = True
        self.app = FLASKR.app.app.test_client()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(FLASKR.config["SQLALCHEMY_DATABASE_URI"])

    def test_fetch_all_jobs_200(self):
        """Fetch all jobs"""
        response = self.app.get("/api/crawler/cron_job")
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res["message"], "Jobs fetched successfully")
        self.assertTrue(isinstance(res["jobs"], (list)))

    def test_fetch_crawl_200(self):
        """Fetch all tasks and start crawling"""
        response = self.app.get("/api/crawler/crawl_live")
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res["message"], "Started Crawling today news")
        self.assertTrue(isinstance(res["tasks"], (list)))


if __name__ == "__main__":
    unittest.main()
