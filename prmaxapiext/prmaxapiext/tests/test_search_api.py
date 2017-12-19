# -*- coding: utf-8 -*-
"""Unit test cases for testing the application's controller methods

See http://docs.turbogears.org/1.1/Testing#testing-your-controller for more
information.

"""
import unittest
import requests
import json
import sys

USERID = 7808
USERID_NOT_EXISTS = 11111111111111111111111
USERID_CUSTOMER_NOT_TOKEN = 7809
USERID_CUSTOMER_EXPIRED = 7810
USERID_CUSTOMER_NOT_ACTIVE = 7811
CUSTOMERTYPEID = 24
CUSTOMERTYPEID_NO_TOKEN = 20
CUSTOMERID = 6092

SEARCH_TYPE_KEY = "search_type"
SEARCH_TYPE_OUTLET = "outlet"
SEARCH_TYPE_EMPLOYEE = "employee"

SEARCH_TYPE_OUTLET_OUTLETNAME = "outlet_searchname"
SEARCH_TYPE_OUTLET_INTERESTS = "outlet_interests"
SEARCH_TYPE_OUTLET_OUTLETTYPES = "outlet_outlettypes"
SEARCH_TYPE_OUTLET_COUNTRY = "outlet_countryid"
SEARCH_TYPE_OUTLET_ROLES = "outlet_roles"

SEARCH_TYPE_EMPLOYEE_NAME = "employee_searchname"
SEARCH_TYPE_EMPLOYEE_ROLES = "employee_roles"
SEARCH_TYPE_EMPLOYEE_INTERESTS = 'employee_interests'
SEARCH_TYPE_EMPLOYEE_COUNTRIES = 'employee_countryid'
SEARCH_TYPE_EMPLOYEE_TYPES = 'employee_outlettypes'

SEARCH_TYPE_MODE = "mode"
SEARCHTYPEID_SEARCH = 1

SEARCH_TYPE_PARTIAL = 'search_partial'
SEARCH_PARTIAL_PARTIAL = 2

SEARCH_URL = 'http://prmaxapiservicesext.localhost/search/do_search'
SEARCH_RESULTS_URL = 'http://prmaxapiservicesext.localhost/search/results'


def _start_connection():
    session_params = {'customertypeid':CUSTOMERTYPEID, 'userid':USERID}
    session = requests.get('http://prmaxapiservices.localhost/session/start_session', params=session_params)
    session = session.json()
    return str(session['usersessionid'])        

def _end_connection():
    session_params = {'userid':USERID}
    session = requests.get('http://prmaxapiservices.localhost/session/end_session', params=session_params)

def _assert_exists_all_fields(res):
    assert 'success' in res
    assert res['success'] == 'OK'
    assert 'data' in res
    assert 'results' in res['data']
    assert 'outlettypeid' in res['data']['results']
    assert 'sessionsearchid' in res['data']['results']
    assert 'selected' in res['data']['results']
    assert 'searchby' in res['data']['results']
    assert 'employeeid' in res['data']['results']
    assert 'listname' in res['data']['results']
    assert 'ecustomerid' in res['data']['results']
    assert 'appended' in res['data']['results']
    assert 'outletname' in res['data']['results']
    assert 'listid' in res['data']['results']
    assert 'contactname' in res['data']['results']
    assert 'total' in res['data']['results']
    assert 'outletid' in res['data']['results']
    assert 'customerid' in res['data']['results']
    assert 'total' in res['data']['results']
    assert  res['data']['results']['searchby'] == 'outlet'

def _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url):
    params = {'prmaxsessionid':usersessionid, searchtype:searchtype_value, searchtext:searchtext_value, searchtypeid:searchtypeid_value, searchtype_partial:searchtype_partial_value}
    if url == SEARCH_RESULTS_URL:
        params['customerid'] = CUSTOMERID
    res = requests.get(url, params=params)
    return res.json()    

def _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                               searchtext, searchtext_value, 
                               searchtext2, searchtext_value2, 
                               searchtype_partial, searchtype_partial_value,
                               searchtypeid, searchtypeid_value,
                               url):
    params = {'prmaxsessionid':usersessionid, searchtype:searchtype_value, 
              searchtext:searchtext_value, 
              searchtext2:searchtext_value2, 
              searchtype_partial:searchtype_partial_value,
              searchtypeid:searchtypeid_value}
    if url == SEARCH_URL:
        params['customerid'] = CUSTOMERTYPEID
    res = requests.get(url, params=params)
    return res.json()    

def _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                               searchtext, searchtext_value, 
                               searchtext2, searchtext_value2, 
                               searchtext3, searchtext_value3, 
                               searchtype_partial, searchtype_partial_value,
                               searchtypeid, searchtypeid_value,
                               url):
    params = {'prmaxsessionid':usersessionid, searchtype:searchtype_value, 
              searchtext:searchtext_value, 
              searchtext2:searchtext_value2, 
              searchtext3:searchtext_value3, 
              searchtype_partial: searchtype_partial_value,
              searchtypeid:searchtypeid_value}
    if url == SEARCH_URL:
        params['customerid'] = CUSTOMERTYPEID
    res = requests.get(url, params=params)
    return res.json()    

def _request_with_4_searchtext(usersessionid, searchtype, searchtype_value, 
                               searchtext, searchtext_value, 
                               searchtext2, searchtext_value2, 
                               searchtext3, searchtext_value3, 
                               searchtext4, searchtext_value4, 
                               searchtype_partial, searchtype_partial_value,
                               searchtypeid, searchtypeid_value, url):
    params = {'prmaxsessionid':usersessionid, searchtype:searchtype_value, 
              searchtext:searchtext_value, 
              searchtext2:searchtext_value2, 
              searchtext3:searchtext_value3, 
              searchtext4:searchtext_value4, 
              searchtype_partial:searchtype_partial_value,
              searchtypeid:searchtypeid_value}
    if url == SEARCH_URL:
        params['customerid'] = CUSTOMERTYPEID
    res = requests.get(url, params=params)
    return res.json()    
    
def _request_with_5_searchtext(usersessionid, searchtype, searchtype_value, 
                               searchtext, searchtext_value, 
                               searchtext2, searchtext_value2, 
                               searchtext3, searchtext_value3, 
                               searchtext4, searchtext_value4, 
                               searchtext5, searchtext_value5, 
                               searchtype_partial, searchtype_partial_value,
                               searchtypeid, searchtypeid_value,
                               url):
    params = {'prmaxsessionid':usersessionid, searchtype:searchtype_value, 
              searchtext:searchtext_value, 
              searchtext2:searchtext_value2, 
              searchtext3:searchtext_value3, 
              searchtext4:searchtext_value4, 
              searchtext5:searchtext_value5, 
              searchtype_partial:searchtype_partial_value,
              searchtypeid:searchtypeid_value}
    if url == SEARCH_URL:
        params['customerid'] = CUSTOMERTYPEID
    res = requests.get(url, params=params)
    return res.json()    
    


def _assert_exists_all_result_fields(res):
    assert 'items' in res
    assert 'numRows' in res
    assert 'identifier' in res
    
def _assert_exist_items_fields(item):
    assert 'sessionsearchid' in item
    assert 'sortname' in item
    assert 'employeeid' in item
    assert 'outletname' in item
    assert 'contactname' in item
    assert 'outletid' in item
    assert 'job_title' in item


class TestSearchOutlet(unittest.TestCase):

    def setUp(self):
        pass

    def test_search_outletname(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        searchtext_value = 'times'
        url = SEARCH_URL
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        assert searchtext_value in (res['data']['results']['outletname'].lower())
        
        searchtext_value = 'international'
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        assert searchtext_value in (res['data']['results']['outletname'].lower())

        searchtext_value = 'independent'
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)        
        _assert_exists_all_fields(res)
        assert searchtext_value in (res['data']['results']['outletname'].lower())

        _end_connection()

    def test_search_keywords_correct_data_correct_logic(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        searchtext_value = '{"data":[105],"logic":"2"}'
        url = SEARCH_URL
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)        
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 19)
        
        searchtext_value = '{"data":[105,103],"logic":"2"}'
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)        
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 40)
        
        _end_connection()
 
    def test_search_keywords_wrong_data(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[111111111],"logic":"2"}'
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)        
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 0)

        _end_connection()

    def test_search_keywords_Logic_OR(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[828,562],"logic":"2"}'
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)        
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 37)

        _end_connection()

    def test_search_keywords_Logic_AND(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[828,562],"logic":"1"}'
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)        
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 6)

        _end_connection()

    def test_search_media_channels(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[1],"logic":"2"}'

        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)        
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 40)

        searchtext_value = '{"data":[1,2,3,5],"logic":"2"}'
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)        
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 127)
        _end_connection()

    def test_search_country(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_COUNTRY
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[1],"logic":"2"}'
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)        
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 13213)

        _end_connection()

    def test_search_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[2908],"logic":"2"}'
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)        
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 206)

        _end_connection()
        
    def test_search_outletname_keywords(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = 'times'
        searchtext_value2 = '{"data":[891],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 3)

        _end_connection()

    def test_search_outletname_media_channels(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL

        searchtext_value = 'times'
        searchtext_value2 = '{"data":[1],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 7)

        _end_connection()

    def test_search_outletname_country(self):
                
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = 'times'
        searchtext_value2 = '{"data":[1],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 249)

        _end_connection()

    def test_search_outletname_roles(self):
                
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = 'times'
        searchtext_value2 = '{"data":[2908],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 5)

        _end_connection()

    def test_search_keywords_media_channels(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL

        searchtext_value = '{"data":[891],"logic":"2"}'
        searchtext_value2 = '{"data":[1,2,3,5],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 15)

        _end_connection()

    def test_search_keywords_country(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[891],"logic":"2"}'
        searchtext_value2 = '{"data":[1],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 232)

        _end_connection()

    def test_search_keywords_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        searchtext_value = '{"data":[891],"logic":"2"}'
        searchtext_value2 = '{"data":[2908],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 6)

        _end_connection()

    def test_search_media_channels_country(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[1],"logic":"2"}'
        searchtext_value2 = '{"data":[1],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 26)

        _end_connection()

    def test_search_media_channels_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[1],"logic":"2"}'
        searchtext_value2 = '{"data":[2908],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 9)

        _end_connection()

    def test_search_country_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_COUNTRY
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[1],"logic":"2"}'
        searchtext_value2 = '{"data":[2908],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 195)

        _end_connection()

    def test_search_outletname_keywords_media_channels(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtext3 = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = 'times'
        searchtext_value2 = '{"data":[1,2,3,5],"logic":"2"}'
        searchtext_value3 = '{"data":[891],"logic":"2"}'        

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 3)

        _end_connection()

    def test_search_outletname_keywords_country(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtext3 = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        searchtext_value = 'times'
        searchtext_value2 = '{"data":[1],"logic":"2"}'
        searchtext_value3 = '{"data":[376],"logic":"2"}'        

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 3)

        _end_connection()

    def test_search_outletname_keywords_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_ROLES
        searchtext3 = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        searchtext_value = 'times'
        searchtext_value2 = '{"data":[3501],"logic":"2"}'
        searchtext_value3 = '{"data":[376],"logic":"2"}'        

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 4)

        _end_connection()

    def test_search_outletname_media_channels_country(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtext3 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        searchtext_value = 'times'
        searchtext_value2 = '{"data":[1,2,3,5],"logic":"2"}'
        searchtext_value3 = '{"data":[1],"logic":"2"}'        

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 21)

        _end_connection()

    def test_search_outletname_media_channels_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtext3 = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        searchtext_value = 'times'
        searchtext_value2 = '{"data":[1,2,3,5],"logic":"2"}'
        searchtext_value3 = '{"data":[3501],"logic":"2"}'        

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 21)

        _end_connection()

    def test_search_outletname_country_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtext3 = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        searchtext_value = 'times'
        searchtext_value2 = '{"data":[1],"logic":"2"}'
        searchtext_value3 = '{"data":[3501],"logic":"2"}'        

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 226)

        _end_connection()
        
    def test_search_keywords_country_media_channels(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtext3 = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[1,2,3,5],"logic":"2"}'        
        searchtext_value2 = '{"data":[1],"logic":"2"}'
        searchtext_value3 = '{"data":[376],"logic":"2"}'        
        
        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 1)

        _end_connection()

    def test_search_keywords_country_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtext3 = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        searchtext_value = '{"data":[3501],"logic":"2"}'        
        searchtext_value2 = '{"data":[1],"logic":"2"}'
        searchtext_value3 = '{"data":[376],"logic":"2"}'        
        
        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 394)

        _end_connection()

    def test_search_media_channels_country_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtext3 = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        searchtext_value = '{"data":[3501],"logic":"2"}'        
        searchtext_value2 = '{"data":[1],"logic":"2"}'
        searchtext_value3 = '{"data":[1,2,3,5],"logic":"2"}'        
        
        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 73)

        _end_connection()

    def test_search_keywords_media_channels_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtext3 = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        searchtext_value = '{"data":[3501],"logic":"2"}'        
        searchtext_value2 = '{"data":[1,2,3,5],"logic":"2"}'
        searchtext_value3 = '{"data":[376],"logic":"2"}'        
        
        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 2)

        _end_connection()

    def test_search_keywords_media_channels_roles_country(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtext3 = SEARCH_TYPE_OUTLET_INTERESTS
        searchtext4 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[3501],"logic":"2"}'        
        searchtext_value2 = '{"data":[1,2,3,5],"logic":"2"}'
        searchtext_value3 = '{"data":[376],"logic":"2"}'        
        searchtext_value4 = '{"data":[1],"logic":"2"}'        
        
        res = _request_with_4_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtext4, searchtext_value4, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        self.assertEqual(res['data']['results']['total'], 1)

        _end_connection()

    def test_search_outletname_keywords_country_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtext3 = SEARCH_TYPE_OUTLET_INTERESTS
        searchtext4 = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[3501],"logic":"2"}'        
        searchtext_value2 = '{"data":[1],"logic":"2"}'
        searchtext_value3 = '{"data":[376],"logic":"2"}'        
        searchtext_value4 = 'times'        
        
        res = _request_with_4_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtext4, searchtext_value4, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 3)

        _end_connection()

    def test_search_outletname_keywords_media_channels_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtext3 = SEARCH_TYPE_OUTLET_INTERESTS
        searchtext4 = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[3501],"logic":"2"}'        
        searchtext_value2 = '{"data":[1,2,3,5],"logic":"2"}'
        searchtext_value3 = '{"data":[376],"logic":"2"}'        
        searchtext_value4 = 'times'        
        
        res = _request_with_4_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtext4, searchtext_value4, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 2)

        _end_connection()

    def test_search_outletname_country_media_channels_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtext3 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtext4 = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        searchtext_value = '{"data":[3501],"logic":"2"}'        
        searchtext_value2 = '{"data":[1,2,3,5],"logic":"2"}'
        searchtext_value3 = '{"data":[1],"logic":"2"}'        
        searchtext_value4 = 'times'        
        
        res = _request_with_4_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtext4, searchtext_value4, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'],15)

        _end_connection()

    def test_search_outletname_keywords_country_media_channels(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtext3 = SEARCH_TYPE_OUTLET_INTERESTS
        searchtext4 = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[1,2,3,5],"logic":"2"}'        
        searchtext_value2 = '{"data":[1],"logic":"2"}'
        searchtext_value3 = '{"data":[376],"logic":"2"}'        
        searchtext_value4 = 'times'        
        
        res = _request_with_4_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtext4, searchtext_value4, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 1)

        _end_connection()

    def test_search_outletname_roles_country_media_channels(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtext3 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtext4 = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        searchtext_value = '{"data":[3501],"logic":"2"}'        
        searchtext_value2 = '{"data":[1,2,3,5],"logic":"2"}'
        searchtext_value3 = '{"data":[1],"logic":"2"}'        
        searchtext_value4 = 'times'        
        
        res = _request_with_4_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtext4, searchtext_value4, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 15)

        _end_connection()

    def test_search_outletname_keywords_media_channels_country_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtext2 = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtext3 = SEARCH_TYPE_OUTLET_COUNTRY
        searchtext4 = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtext5 = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL        
        url = SEARCH_URL
        
        searchtext_value = '{"data":[3501],"logic":"2"}'        
        searchtext_value2 = '{"data":[1,2,3,5],"logic":"2"}'
        searchtext_value3 = '{"data":[1],"logic":"2"}'        
        searchtext_value4 = 'times'        
        searchtext_value5 = '{"data":[104],"logic":"2"}'        
        
        res = _request_with_5_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtext4, searchtext_value4, 
                                       searchtext5, searchtext_value5, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 4)

        _end_connection()



class TestSearchEmployee(unittest.TestCase):

    def setUp(self):
        pass
    
    def test_search_employeename(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_NAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value =  'daniel'
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        assert searchtext_value in (res['data']['results']['contactname'].lower())
        self.assertEqual(res['data']['results']['total'], 24)

        
        searchtext_value = 'smith'
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        assert searchtext_value in (res['data']['results']['contactname'].lower())
        self.assertEqual(res['data']['results']['total'], 517)

        searchtext_value = 'evans'
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        assert searchtext_value in (res['data']['results']['contactname'].lower())
        self.assertEqual(res['data']['results']['total'], 215)

        _end_connection()

    def test_search_keyword_correct_data_corect_logic(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[105],"logic":"2"}'
                
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 42)
        
        _end_connection()

    def test_search_keyword_wrong_data(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[111111111],"logic":"2"}'        
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 0)
        
        _end_connection()
        
    def test_search_keywords_Logic_OR(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[828,562],"logic":"2"}'        
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 413)
        
        _end_connection()        
    
    def test_search_keywords_Logic_AND(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[828,562],"logic":"1"}'        
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 34)
        
        _end_connection()        

    def test_search_media_channels(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[1],"logic":"2"}'     
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 4859)
        
        _end_connection()        

    def test_search_country(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[1],"logic":"2"}' 
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 57850)
        
        _end_connection()       

    def test_search_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[2908],"logic":"2"}' 
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 286)
        
        _end_connection()       

    def test_search_employeename_keyword(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_NAME
        searchtext2 = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = 'smith'
        searchtext_value2 = '{"data":[891],"logic":"2"}' 

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 6)

        _end_connection()  
        
    def test_search_employeename_media_channels(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_NAME
        searchtext2 = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = 'smith'
        searchtext_value2 = '{"data":[1],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 44)

        _end_connection()  
        
    def test_search_employeename_country(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_NAME
        searchtext2 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = 'smith'
        searchtext_value2 = '{"data":[1],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 508)

        _end_connection()  

    def test_search_employeename_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_NAME
        searchtext2 = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = 'smith'
        searchtext_value2 = '{"data":[2908],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 4)

        _end_connection()  
        
    def test_search_keywords_media_channels(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtext2 = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[891],"logic":"2"}'
        searchtext_value2 = '{"data":[1,2,3,5],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 172)

        _end_connection()  

    def test_search_keywords_country(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtext2 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[891],"logic":"2"}'
        searchtext_value2 = '{"data":[1],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2,
                                       searchtype_partial, searchtype_partial_value, 
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 1351)

        _end_connection()  

    def test_search_keywords_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtext2 = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[891],"logic":"2"}'
        searchtext_value2 = '{"data":[3501],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 331)

        _end_connection()  

    def test_search_media_channels_country(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtext2 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = searchtext_value2 = '{"data":[1],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 4137)

        _end_connection()  

    def test_search_media_channels_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtext2 = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[1],"logic":"2"}'
        searchtext_value2 = '{"data":[3501],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 401)

        _end_connection()  

    def test_search_country_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtext2 = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[1],"logic":"2"}'
        searchtext_value2 = '{"data":[3501],"logic":"2"}'

        res = _request_with_2_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 15411)

        _end_connection()  

    def test_search_employeename_keywords_media_channels(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_NAME
        searchtext2 = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtext3 = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = 'smith'
        searchtext_value2 = '{"data":[1,2,3,5],"logic":"2"}'
        searchtext_value3 = '{"data":[104],"logic":"2"}'       

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 15)

        _end_connection()  
        
    def test_search_employeename_keywords_country(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_NAME
        searchtext2 = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtext3 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = 'smith'
        searchtext_value2 = '{"data":[104],"logic":"2"}'  
        searchtext_value3 = '{"data":[1],"logic":"2"}'       

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 28)

        _end_connection()  

    def test_search_employeename_keywords_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_NAME
        searchtext2 = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtext3 = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = 'smith'
        searchtext_value2 = '{"data":[376],"logic":"2"}'  
        searchtext_value3 = '{"data":[3501],"logic":"2"}'       

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 6)

        _end_connection()  
        
    def test_search_employeename_media_channels_country(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_NAME
        searchtext2 = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtext3 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = 'smith'
        searchtext_value2 = '{"data":[1],"logic":"2"}'  
        searchtext_value3 = '{"data":[1],"logic":"2"}'       

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 40)

        _end_connection()  

    def test_search_employeename_media_channels_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_NAME
        searchtext2 = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtext3 = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = 'smith'
        searchtext_value2 = '{"data":[1],"logic":"2"}'  
        searchtext_value3 = '{"data":[3501],"logic":"2"}'       

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 3)

        _end_connection()  

    def test_search_employeename_country_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_NAME
        searchtext2 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtext3 = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = 'smith'
        searchtext_value2 = '{"data":[1],"logic":"2"}'  
        searchtext_value3 = '{"data":[3501],"logic":"2"}'       

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 127)

        _end_connection()  

    def test_search_keywords_country_media_channels(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtext2 = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtext3 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[1,2,3,5],"logic":"2"}'
        searchtext_value2 = '{"data":[104],"logic":"2"}'  
        searchtext_value3 = '{"data":[1],"logic":"2"}'       

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 595)

        _end_connection()  
        
    def test_search_keywords_country_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtext2 = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtext3 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[104],"logic":"2"}'
        searchtext_value2 = '{"data":[3501],"logic":"2"}'  
        searchtext_value3 = '{"data":[1],"logic":"2"}'       

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 526)

        _end_connection()  

    def test_search_country_media_channels_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtext2 = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtext3 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[1],"logic":"2"}'
        searchtext_value2 = '{"data":[3501],"logic":"2"}'  
        searchtext_value3 = '{"data":[1],"logic":"2"}'       

        res = _request_with_3_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 345)

        _end_connection()  
        
    def test_search_employeename_keywords_country_media_channels(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtext2 = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtext3 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtext4 = SEARCH_TYPE_EMPLOYEE_NAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[1,2,3,5],"logic":"2"}'
        searchtext_value2 = '{"data":[104],"logic":"2"}'  
        searchtext_value3 = '{"data":[1],"logic":"2"}' 
        searchtext_value4 = 'smith'

        res = _request_with_4_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtext4, searchtext_value4, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 15)

        _end_connection()  
        
    def test_search_employeename_keywords_country_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtext2 = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtext3 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtext4 = SEARCH_TYPE_EMPLOYEE_NAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[3501],"logic":"2"}'
        searchtext_value2 = '{"data":[104],"logic":"2"}'  
        searchtext_value3 = '{"data":[1],"logic":"2"}' 
        searchtext_value4 = 'smith'

        res = _request_with_4_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtext4, searchtext_value4, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 6)

        _end_connection()  
        
    def test_search_employeename_keywords_media_channels_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtext2 = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtext3 = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtext4 = SEARCH_TYPE_EMPLOYEE_NAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[3501],"logic":"2"}'
        searchtext_value2 = '{"data":[104],"logic":"2"}'  
        searchtext_value3 = '{"data":[24],"logic":"2"}' 
        searchtext_value4 = 'smith'

        res = _request_with_4_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtext4, searchtext_value4, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 1)

        _end_connection()  
        
    def test_search_employeename_country_media_channels_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtext2 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtext3 = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtext4 = SEARCH_TYPE_EMPLOYEE_NAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[3501],"logic":"2"}'
        searchtext_value2 = '{"data":[1],"logic":"2"}'  
        searchtext_value3 = '{"data":[24],"logic":"2"}' 
        searchtext_value4 = 'smith'

        res = _request_with_4_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtext4, searchtext_value4, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 2)

        _end_connection()  
        
    def test_search_keywords_country_media_channels_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtext2 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtext3 = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtext4 = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[3501],"logic":"2"}'
        searchtext_value2 = '{"data":[1],"logic":"2"}'  
        searchtext_value3 = '{"data":[24],"logic":"2"}' 
        searchtext_value4 = '{"data":[104],"logic":"2"}' 

        res = _request_with_4_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtext4, searchtext_value4, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 1)

        _end_connection()  
        
    def test_search_employeename_keywords_country_media_channels_roles(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_EMPLOYEE
        searchtext = SEARCH_TYPE_EMPLOYEE_ROLES
        searchtext2 = SEARCH_TYPE_EMPLOYEE_COUNTRIES
        searchtext3 = SEARCH_TYPE_EMPLOYEE_TYPES
        searchtext4 = SEARCH_TYPE_EMPLOYEE_INTERESTS
        searchtext5 = SEARCH_TYPE_EMPLOYEE_NAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL
        url = SEARCH_URL
        searchtext_value = '{"data":[3501],"logic":"2"}'
        searchtext_value2 = '{"data":[1],"logic":"2"}'  
        searchtext_value3 = '{"data":[24],"logic":"2"}' 
        searchtext_value4 = '{"data":[104],"logic":"2"}' 
        searchtext_value5 = 'smith' 

        res = _request_with_5_searchtext(usersessionid, searchtype, searchtype_value, 
                                       searchtext, searchtext_value, 
                                       searchtext2, searchtext_value2, 
                                       searchtext3, searchtext_value3, 
                                       searchtext4, searchtext_value4, 
                                       searchtext5, searchtext_value5, 
                                       searchtype_partial, searchtype_partial_value,
                                       searchtypeid, searchtypeid_value,url)
        _assert_exists_all_fields(res)
        self.assertEqual(res['data']['results']['total'], 1)

        _end_connection()  





class TestSearchOutletResults(unittest.TestCase):

    def setUp(self):
        pass

    def test_search_outletname(self):
        
        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETNAME
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL 
        url = SEARCH_RESULTS_URL
        searchtext_value = 'times'
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_result_fields(res)
#        assert res['numRows'] == 265
        _assert_exist_items_fields(res['items'][0])

        _end_connection()        

    def test_search_keywords(self):

        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_INTERESTS
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL 
        url = SEARCH_RESULTS_URL
        searchtext_value = '{"data":[105],"logic":"2"}'
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_result_fields(res)
#        assert res['numRows'] == 19
        _assert_exist_items_fields(res['items'][0])
        
        _end_connection()

    def test_search_media_channels(self):

        usersessionid = _start_connection()
        searchtype = SEARCH_TYPE_KEY
        searchtype_value = SEARCH_TYPE_OUTLET
        searchtext = SEARCH_TYPE_OUTLET_OUTLETTYPES
        searchtypeid = SEARCH_TYPE_MODE
        searchtypeid_value = SEARCHTYPEID_SEARCH
        searchtype_partial = SEARCH_TYPE_PARTIAL
        searchtype_partial_value = SEARCH_PARTIAL_PARTIAL 
        url = SEARCH_RESULTS_URL
        searchtext_value = '{"data":[1],"logic":"2"}'
        
        res = _request_with_1_searchtext(usersessionid, searchtype, searchtype_value, searchtext, searchtext_value, searchtype_partial, searchtype_partial_value, searchtypeid, searchtypeid_value,url)
        _assert_exists_all_result_fields(res)
#        assert res['numRows'] == 40
        _assert_exist_items_fields(res['items'][0])
        
        _end_connection()
        
        
if __name__ == '__main__':
    unittest.main()
