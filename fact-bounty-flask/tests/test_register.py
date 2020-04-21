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
    name="name",
    email="example@gmail.com",
    credential1="test1credentials",
    credential2="test1credentials",
)


class Test_Register(unittest.TestCase):
    @classmethod
    def setUpClass(self):
        self.db_fd, self.db_path = db_fd, db_path
        FLASKR.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///' + self.db_path
        FLASKR.testing = True
        self.app = FLASKR.test_client()

    @classmethod
    def tearDownClass(self):
        pass
        # os.close(self.db_fd)
        # os.unlink(self.db_path)
        # FLASKR.db.session.remove()
        # FLASKR.db.drop_all()

    def test_can_register(self):
        """Register a new user."""
        response = self.app.post(
            "/api/users/register",
            data=json.dumps(
                dict(
                    name=USER_DATA["name"],
                    email=USER_DATA["email"],
                    password=USER_DATA["credential1"],
                    password2=USER_DATA["credential2"],
                )
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            res["message"], "You registered successfully. Please log in."
        )

    def test_sees_error_message_if_passwords_dont_match(self):
        """Show error if passwords don't match."""
        response = self.app.post(
            "/api/users/register",
            data=json.dumps(
                dict(
                    name=USER_DATA["name"],
                    email=USER_DATA["email"] + "x",
                    password=USER_DATA["credential1"],
                    password2=USER_DATA["credential2"] + "x",
                )
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(res["message"], "Both passwords does not match")

    def test_sees_error_message_if_user_already_registered(self):
        """Show error if user already registered."""
        response = self.app.post(
            "/api/users/register",
            data=json.dumps(
                dict(
                    name=USER_DATA["name"],
                    email=USER_DATA["email"],
                    password=USER_DATA["credential1"],
                    password2=USER_DATA["credential2"],
                )
            ),
            content_type="application/json",
            follow_redirects=True,
        )
        res = response.data.decode("ASCII")
        res = json.loads(res)
        self.assertEqual(response.status_code, 202)
        self.assertEqual(res["message"], "User already exists. Please login.")


if __name__ == "__main__":
    unittest.main()
