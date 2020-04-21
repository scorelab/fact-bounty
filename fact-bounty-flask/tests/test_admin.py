import os
import unittest
import tempfile
import json
import sys
from app import app
from fake_db import db_fd, db_path

sys.path.append(os.path.join(sys.path[0], "../../"))
FLASKR = app


class Test_Admin(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.db_fd, self.db_path = db_fd, db_path
        FLASKR.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///' + self.db_path
        FLASKR.testing = True
        self.app = FLASKR.test_client()

    @classmethod
    def tearDownClass(self):
        # os.close(self.db_fd)
        # os.unlink(self.db_path)
        pass

    def test_fetch_system_panel_200(self):
        """Get System Panel Information"""
        response = self.app.get("/api/admin/system")
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res["message"], "Data fetched successfully!")
        self.assertTrue(isinstance(res["data"], (dict)))


if __name__ == "__main__":
    unittest.main()
