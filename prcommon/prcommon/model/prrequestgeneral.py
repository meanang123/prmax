# -*- coding: utf-8 -*-
"""prrequest tweets"""
#-----------------------------------------------------------------------------
# Name:       prrequests.py
# Purpose:
# Author:      Chris Hoy
# Created:     28/03/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import session
from ttl.model import BaseSql

from prcommon.model.prrequests import PRRequest

class PRRequestGeneral(object):
	""" prrequest """

	List_Data_View = """SELECT
	prrequestid,
	twitterid,
	user_name,
	tweet,
	profile_image_url,
	to_char(created, 'DD/MM/YY') as created_display
	FROM prrequest"""
	List_Data_Count = "SELECT COUNT(*) FROM prrequest"

	@staticmethod
	def get_grid( params ):
		""" getPageListGrid """
		whereclause = BaseSql.addclause("", "created > CURRENT_DATE - interval '365 days'")

		if "phrase" in params:
			whereclause = BaseSql.addclause("", "tweet ILIKE :phrase")
			params["phrase"] = "%" + params["phrase"] + "%"

		params['sortfield'] = params.get('sortfield', 'created_display')
		if not params['sortfield']:
			params['sortfield'] = "created_display"
		if params['sortfield'] == "created_display":
			params['sortfield'] = "created"
			params['direction'] = "desc"

		return BaseSql.getGridPage( params,
		                            'created',
		                            'prrequestid',
		                            PRRequestGeneral.List_Data_View + whereclause + BaseSql.Standard_View_Order,
		                            PRRequestGeneral.List_Data_Count + whereclause,
		                            PRRequest )

#https://mobile.twitter.com/'+ screenName + '/status/' + tweetId
