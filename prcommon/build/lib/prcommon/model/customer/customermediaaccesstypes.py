# -*- coding: utf-8 -*-
""" CustomerMediaAccessTypes """
#-----------------------------------------------------------------------------
# Name:       customermediaaccesstypes.py
# Purpose:	
#
# Author:   
#
# Created:    Oct 2016
# Copyright:   (c) 2016
#-----------------------------------------------------------------------------
from turbogears.database import metadata, mapper
from sqlalchemy import Table


class CustomerMediaAccessTypes(object):
    """ media access types for customers """

    pass


CustomerMediaAccessTypes.mapping = Table('customermediaaccesstypes', metadata, autoload=True, schema="internal")

mapper(CustomerMediaAccessTypes, CustomerMediaAccessTypes.mapping)
