# -*- coding: utf-8 -*-
"""ttljson"""
#-----------------------------------------------------------------------------
# Name:        ttljson.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     05/10/2012
# Copyright:   (c) 2012
# Licence:
#-----------------------------------------------------------------------------

import datetime
from time import mktime
import simplejson

class TtlJsonEncoder(simplejson.JSONEncoder):
    """ttljson encodeed """
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return int(mktime(obj.timetuple()))

        if isinstance(obj, datetime.date):
            return int(mktime(obj.timetuple()))

        return simplejson.JSONEncoder.default(self, obj)


def to_dojo_string(instring):
    """Fix up string for json"""

    return instring.replace("'", "&#39;")
