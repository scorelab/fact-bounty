import os
import unittest
import tempfile
import json
import sys

sys.path.append(os.path.join(sys.path[0], "../../"))
FLASKR = __import__("fact-bounty-flask")


class Test_Story(unittest.TestCase):
    def setUp(self):
        self.db_fd,
        FLASKR.config["SQLALCHEMY_DATABASE_URI"] = tempfile.mkstemp()
        FLASKR.testing = True
        self.app = FLASKR.app.app.test_client()

    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(FLASKR.config["SQLALCHEMY_DATABASE_URI"])

    def test_fetch_all_stories_200(self):
        """Fetch all stories"""
        response = self.app.get("/api/stories/all")
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res["message"], "Stories successfully fetched")
        self.assertTrue(isinstance(res["stories"], (list)))

    def test_fetch_range_of_stories_200(self):
        """Fetch range of stories"""
        response = self.app.get("/api/stories/get-range/1")
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res["message"], "Stories successfully fetched")
        self.assertTrue(isinstance(res["stories"], (list)))

    def test_fetch_single_story(self):
        """Fetch a single story"""
        response = self.app.get("/api/stories/get/1")
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res["message"], "Story fetched successfully")


if __name__ == "__main__":
    unittest.main()
