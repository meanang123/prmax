# -*- coding: utf-8 -*-
"""Send SMS Messages """
#-----------------------------------------------------------------------------
# Name:         ttlsms.py
# Purpose:
#										paperround number 447786204037
# Author:       Chris Hoy
#
# Created:      24/06/2013
# Copyright:    (c) 2013
#-----------------------------------------------------------------------------

import urllib
import urllib2

ESENDEXURL = 'https://www.esendex.com/secure/messenger/formpost/SendSMS.aspx'

			# send a text
			#


def send_paperround_sms( mobile, body):
	"""Send an SMS message"""

	values = {
	  'EsendexUsername' : 'mike@kinton.biz',
	  'EsendexPassword' : 'NDX7995',
	  'EsendexAccount': 'EX0039514',
	  'EsendexRecipient': mobile,
	  'EsendexBody': body,
	  'PlainText': "1",
	}

	data = urllib.urlencode(values)
	req = urllib2.Request(ESENDEXURL, data)
	response = urllib2.urlopen(req)
	the_page = response.read()
	if the_page.find("Result=OK") != -1:
		return (True, "" )
	else:
		return (False, the_page )
