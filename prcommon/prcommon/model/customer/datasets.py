# -*- coding: utf-8 -*-
""" Data Sets """
#-----------------------------------------------------------------------------
# Name:        datasets.py
# Purpose:		Basic Data sets
#
# Author:      Chris Hoy
#
# Created:     01/06/2013
# Copyright:   (c) 2013
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper, session
from sqlalchemy import Table, text
from ttl.model.common import BaseSql

import logging
LOG = logging.getLogger("prmax")

class PrmaxDataSets(BaseSql):
	""" data sets for customers """


class PrmaxDataSetsCountries(BaseSql):
	""" countries that make up a data set """
	pass

PrmaxDataSets.mapping = Table('prmaxdatasets', metadata, autoload=True, schema="internal")
PrmaxDataSetsCountries.mapping = Table('prmaxdatasetcountries', metadata, autoload=True, schema="internal")

mapper(PrmaxDataSetsCountries, PrmaxDataSetsCountries.mapping)
mapper(PrmaxDataSets, PrmaxDataSets.mapping)
