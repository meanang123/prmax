# -*- coding: utf-8 -*-
"""Unit test cases for testing the application's controller methods

See http://docs.turbogears.org/1.1/Testing#testing-your-controller for more
information.

"""
import unittest
import requests
import json

USERID = 7808 # a valid userid that is in the Customer_Token_Login list 
USERID_NOT_EXISTS = 11111111111111111111111 #an invalid userid
USERID_CUSTOMER_NOT_TOKEN = 7809 # a valid userid that is not in the Customer_Token_Login list
USERID_CUSTOMER_EXPIRED = 7810 # a valid userid that is in the Customer_Token_Login list but it has expired
USERID_CUSTOMER_NOT_ACTIVE = 7811 # a valid userid that is in the Customer_Token_Login list but it not active
CUSTOMERTYPEID = 24
CUSTOMERTYPEID_NO_TOKEN = 20
CUSTOMERID = 6092
class TestAPISession(unittest.TestCase):

    def setUp(self):
        pass

    def test_start_session_succeed(self):
        params = {'userid':USERID, 'customertypeid':CUSTOMERTYPEID}
        res = requests.get('http://prmaxapiservices.localhost/session/start_session', params=params)
        res = res.json()
        assert 'usersessionid' in res 
        self.assertEqual( res['success'], 'OK')

    def test_start_session_invalid_account(self):
        params = {'userid':USERID, 'customertypeid':CUSTOMERTYPEID_NO_TOKEN}
        res = requests.get('http://prmaxapiservices.localhost/session/start_session', params=params)
        res = res.json()
        assert 'usersessionid' not in res 
        self.assertEqual( res['success'], 'FA')
        assert 'message' in res
        self.assertEqual(res['message'][0], 2)
        self.assertEqual(res['message'][1], 'Invalid Account Information')
        
    def test_start_session_missing_user(self):
        params = {'userid':USERID_NOT_EXISTS,'customertypeid':CUSTOMERTYPEID}
        res = requests.get('http://prmaxapiservices.localhost/session/start_session', params=params)
        res = res.json()
        assert 'usersessionid' not in res 
        self.assertEqual( res['success'], 'FA')
        assert 'message' in res
        self.assertEqual(res['message'][0], 1)
        self.assertEqual(res['message'][1], 'Missing User')
        
    def test_start_session_invalid_account2(self):
        params = {'userid':USERID_CUSTOMER_NOT_TOKEN, 'customertypeid':CUSTOMERTYPEID}
        res = requests.get('http://prmaxapiservices.localhost/session/start_session', params=params)
        res = res.json()
        assert 'usersessionid' not in res 
        self.assertEqual( res['success'], 'FA')
        assert 'message' in res
        self.assertEqual(res['message'][0], 2)
        self.assertEqual(res['message'][1], 'Invalid Account Information')

    def test_start_session_expired_customer(self):
        params = {'userid':USERID_CUSTOMER_EXPIRED, 'customertypeid':CUSTOMERTYPEID}
        res = requests.get('http://prmaxapiservices.localhost/session/start_session', params=params)
        res = res.json()
        assert 'usersessionid' not in res 
        self.assertEqual( res['success'], 'FA')
        assert 'message' in res
        self.assertEqual(res['message'][0], 3)
        self.assertEqual(res['message'][1], 'Licence Expired')

    def test_start_session_customer_not_active(self):
        params = {'userid':USERID_CUSTOMER_NOT_ACTIVE, 'customertypeid':CUSTOMERTYPEID}
        res = requests.get('http://prmaxapiservices.localhost/session/start_session', params=params)
        res = res.json()
        assert 'usersessionid' not in res 
        self.assertEqual( res['success'], 'FA')
        assert 'message' in res
        self.assertEqual(res['message'][0], 4)
        self.assertEqual(res['message'][1], 'Account Inactive')

    def test_end_session_using_userid(self):
        params = {'userid':USERID, 'customertypeid':CUSTOMERTYPEID}
        res = requests.get('http://prmaxapiservices.localhost/session/end_session', params=params)
        res = res.json()
        self.assertEqual( res['success'], 'OK')

    def test_end_session_using_usersessionid(self):
        usersessionid = self._start_session()
        params = {'usersessionid':usersessionid}
        res = requests.get('http://prmaxapiservices.localhost/session/end_session', params=params)
        res = res.json()
        self.assertEqual( res['success'], 'OK')
        
    def test_active_users_using_userid(self):
        params = {'userid':USERID}
        res = requests.get('http://prmaxapiservices.localhost/session/active_users', params=params)
        res = res.json()
        self.assertEqual( res['success'], 'OK')
        assert 'users' in res
        self.assertEqual( len(res['users']), 1)
        self.assertEqual( res['users'][0], 7808)

    def test_active_users_using_customerid(self):
        params = {'customerid':CUSTOMERID}
        res = requests.get('http://prmaxapiservices.localhost/session/active_users', params=params)
        res = res.json()
        self.assertEqual( res['success'], 'OK')
        assert 'users' in res
        self.assertEqual( len(res['users']), 1)
        self.assertEqual( res['users'][0], 7808)


    def _start_session(self):
        params = {'userid':USERID, 'customertypeid':CUSTOMERTYPEID}
        res = requests.get('http://prmaxapiservices.localhost/session/start_session', params=params)        
        res = res.json()
        return res['usersessionid']


if __name__ == '__main__':
    unittest.main()
