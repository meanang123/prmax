# -*- coding: utf-8 -*-
""" Group by dates """
#-----------------------------------------------------------------------------
# Name:       groupby.py
# Purpose:	  group by dates options
#
# Author:      Stamatia Vatsi
#
# Created:     03/01/2019
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table


class GroupBy(object):
	""" Group By """

	pass


GroupBy.mapping = Table('groupby', metadata, autoload=True, schema="internal")

mapper(GroupBy, GroupBy.mapping)
