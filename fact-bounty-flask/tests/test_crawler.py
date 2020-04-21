import os
import unittest
import tempfile
import json
import sys
from app import app
from fake_db import db_fd, db_path

sys.path.append(os.path.join(sys.path[0], "../../"))
FLASKR = app

TEST_MONTH = '04'
TEST_DAY = '15'


class Test_Crawler(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.db_fd, self.db_path = db_fd, db_path
        FLASKR.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///' + self.db_path
        FLASKR.testing = True
        self.app = FLASKR.test_client()
        res = self.app.post(
            "/api/crawler/cron_job",
            data=json.dumps(
                dict(
                    month=TEST_MONTH,
                    day=TEST_DAY
                )
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = res.data.decode("ASCII")
        res = json.loads(res)

    @classmethod
    def tearDownClass(self):
        # os.close(self.db_fd)
        # os.unlink(self.db_path)
        pass

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
