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
    name="name2",
    email="example2@gmail.com",
    password="test2credentials",
    password2="test2credentials",
)


class Test_Login(unittest.TestCase):
    @classmethod
    def setUp(self):
        self.db_fd, self.db_path = db_fd, db_path
        FLASKR.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///' + self.db_path
        FLASKR.testing = True
        self.app = FLASKR.test_client()
        self.app.post(
            "/api/users/register",
            data=json.dumps(
                dict(
                    name=USER_DATA["name"],
                    email=USER_DATA["email"],
                    password=USER_DATA["password"],
                    password2=USER_DATA["password2"],
                )
            ),
            content_type="application/json",
            follow_redirects=True,
        )

    @classmethod
    def tearDownClass(self):
        # os.close(self.db_fd)
        # os.unlink(self.db_path)
        pass

    def test_can_log_in_returns_200(self):
        """Login successful."""
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
        self.assertEqual(response.status_code, 200)
        self.assertEqual(res["message"], "You logged in successfully.")
        self.assertNotEqual(res["access_token"], "")

    def test_sees_error_message_if_password_is_incorrect(self):
        """Show error if password is incorrect."""
        response = self.app.post(
            "/api/users/login",
            data=json.dumps(
                dict(
                    email=USER_DATA["email"],
                    password=USER_DATA["password"] + "x",
                )
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 402)
        self.assertEqual(
            res["message"], "Wrong password, Please try again"
        )

    def test_sees_error_message_if_username_doesnt_exist(self):
        """Show error if username doesn't exist."""
        response = self.app.post(
            "/api/users/login",
            data=json.dumps(
                dict(
                    email=USER_DATA["email"] + "x",
                    password=USER_DATA["password"],
                )
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            res["message"], "Invalid email, Please try again"
        )


if __name__ == "__main__":
    unittest.main()
