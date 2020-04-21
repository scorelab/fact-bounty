import os
import unittest
import tempfile
import json
import sys
from app import app
from fake_db import db_fd, db_path

sys.path.append(os.path.join(sys.path[0], "../../"))
FLASKR = app

USER_DATA = dict(
    name="Admin",
    email="admin@gmail.com",
    password="test3credentials",
    password2="test3credentials",
    role="admin"
)


class Test_Story(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.db_fd, self.db_path = db_fd, db_path
        FLASKR.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///' + self.db_path
        FLASKR.testing = True
        self.app = FLASKR.test_client()
        # Registering the user as admin
        self.app.post(
            "/api/users/register",
            data=json.dumps(
                dict(
                    name=USER_DATA["name"],
                    email=USER_DATA["email"],
                    password=USER_DATA["password"],
                    password2=USER_DATA["password2"],
                    role=USER_DATA["role"]
                )
            ),
            content_type="application/json",
            follow_redirects=True,
        )

        # Logging in as admin
        response = self.app.post(
            "/api/users/login",
            data=json.dumps(
                dict(email=USER_DATA["email"], password=USER_DATA["password"])
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.access_token = res['access_token']

    @classmethod
    def tearDownClass(self):
        # os.close(self.db_fd)
        # os.unlink(self.db_path)
        pass

    def test_fetch_all_stories_200(self):
        """Fetch all stories"""
        response = self.app.get(
            "/api/stories/all",
            headers=dict(
                Authorization='Bearer ' + self.access_token
            )
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res["message"], "Stories successfully fetched")
        self.assertTrue(isinstance(res["stories"], (dict)))

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
