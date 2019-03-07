import os
import unittest
import tempfile
import json

FLASKR = __import__('fact-bounty-flask')

USER_DATA = dict(
    email='example@gmail.com',
    password='password',
)

class Test_Login(unittest.TestCase):
    def setUp(self):
        self.db_fd, FLASKR.config['SQLALCHEMY_DATABASE_URI'] = tempfile.mkstemp()
        FLASKR.testing = True
        self.app = FLASKR.app.app.test_client()


    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(FLASKR.config['SQLALCHEMY_DATABASE_URI'])


    def test_can_log_in_returns_200(self):
        """Login successful."""
        response = self.app.post('/api/users/login',data=dict(email=USER_DATA['email'],password=USER_DATA['password']),follow_redirects=True)
        res = response.data.decode('ASCII')
        res = json.loads(res)
        assert response.status_code == 200
        assert res['message'] =='You logged in successfully.'
        assert res['access_token'] != ''

    def test_sees_error_message_if_password_is_incorrect(self):
        """Show error if password is incorrect."""
        response = self.app.post('/api/users/login',data=dict(email=USER_DATA['email'],password=USER_DATA['password']+'x'),follow_redirects=True)
        res = response.data.decode('ASCII')
        res = json.loads(res)
        assert response.status_code == 401
        assert res['message'] == 'Invalid email or password, Please try again'

    def test_sees_error_message_if_username_doesnt_exist(self):
        """Show error if username doesn't exist."""
        response = self.app.post('/api/users/login',data=dict(email=USER_DATA['email'],password=USER_DATA['password']+'x'),follow_redirects=True)
        res = response.data.decode('ASCII')
        res = json.loads(res)
        assert response.status_code == 401
        assert res['message'] == 'Invalid email or password, Please try again'

if __name__ == "__main__":
    unittest.main()