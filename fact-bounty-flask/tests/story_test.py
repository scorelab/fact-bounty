import os
import unittest
import tempfile
import json

FLASKR = __import__('fact-bounty-flask')


class Test_Login(unittest.TestCase):
    def setUp(self):
        self.db_fd, FLASKR.config['SQLALCHEMY_DATABASE_URI'] = tempfile.mkstemp()
        FLASKR.testing = True
        self.app = FLASKR.app.app.test_client()


    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(FLASKR.config['SQLALCHEMY_DATABASE_URI'])

    def test_fetch_all_stories_200(self):
        """Fetch all stories"""
        response = self.app.get('/api/stories/all')
        res = response.data.decode('ASCII')
        res = json.loads(res)
        assert response.status_code == 200
        assert res['message'] == 'Stories successfully fetched'
        assert isinstance(res['stories'], (list)) is True
    
    def test_fetch_range_of_stories_200(self):
        """Fetch range of stories"""
        response = self.app.get('/api/stories/get-range/1')
        res = response.data.decode('ASCII')
        res = json.loads(res)
        assert response.status_code == 200
        assert res['message'] == 'Stories successfully fetched'
        assert isinstance(res['stories'], (list)) is True

if __name__ == "__main__":
    unittest.main()