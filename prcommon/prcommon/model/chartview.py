# -*- coding: utf-8 -*-
""" Chart View """
#-----------------------------------------------------------------------------
# Name:       chartview.py
# Purpose:	  chart view options
#
# Author:      Stamatia Vatsi
#
# Created:     10/12/2018
# Copyright:   (c) 2018
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table


class ChartView(object):
	""" chart view """

	pass


ChartView.mapping = Table('chartview', metadata, autoload=True, schema="internal")

mapper(ChartView, ChartView.mapping)
