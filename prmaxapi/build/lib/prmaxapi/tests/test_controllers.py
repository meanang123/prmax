# -*- coding: utf-8 -*-
"""Unit test cases for testing the application's controller methods

See http://docs.turbogears.org/1.1/Testing#testing-your-controller for more
information.

"""
import unittest
import datetime
from turbogears import testutil
from prmaxapi.controllers import Root
from simplejson import JSONDecoder


class TestPages(testutil.TGTest):

    root = Root

    def test_method(self):
        """The index method should return a datetime.datetime called 'now'"""
        response = self.app.get('/lists/lists?userid=1')
        decoder = JSONDecoder()
        obj = decoder.decode(response.body )
        assert obj["success"] != "OK"


