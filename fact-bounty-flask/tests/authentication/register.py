import os
import unittest
import tempfile
import json

FLASKR = __import__('fact-bounty-flask')

USER_DATA = dict(
    name='name',
    email='example@gmail.com',
    password='password',
    password2='password'
)

class Test_Register(unittest.TestCase):
    def setUp(self):
        self.db_fd, FLASKR.config['SQLALCHEMY_DATABASE_URI'] = tempfile.mkstemp()
        FLASKR.testing = True
        self.app = FLASKR.app.app.test_client()
    
    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(FLASKR.config['SQLALCHEMY_DATABASE_URI'])
        # FLASKR.db.session.remove()
        # FLASKR.db.drop_all()

    def test_can_register(self):
        """Register a new user."""
        response = self.app.post('/api/users/register', data=dict(name=USER_DATA['name'],email=USER_DATA['email'], password=USER_DATA['password'],password2=USER_DATA['password2']), follow_redirects=True)
        res = response.data.decode('ASCII')
        res = json.loads(res)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(res['message'], 'You registered successfully. Please log in.')

    def test_sees_error_message_if_passwords_dont_match(self):
        """Show error if passwords don't match."""
        response = self.app.post('/api/users/register',data=dict(name=USER_DATA['name'],email=USER_DATA['email']+'x',password=USER_DATA['password'],password2=USER_DATA['password2']+'x'),follow_redirects=True)
        res = response.data.decode('ASCII')
        res = json.loads(res)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(res['message'], 'Both passwords does not match')

    def test_sees_error_message_if_user_already_registered(self):
        """Show error if user already registered."""
        response = self.app.post('/api/users/register',data=dict(name=USER_DATA['name'],email=USER_DATA['email'],password=USER_DATA['password'],password2=USER_DATA['password2']),follow_redirects=True)
        res = response.data.decode('ASCII')
        res = json.loads(res)
        self.assertEqual(response.status_code, 202)
        self.assertEqual(res['message'], 'User already exists. Please login.')

if __name__ == "__main__":
    unittest.main()