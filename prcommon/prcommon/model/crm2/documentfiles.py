# -*- coding: utf-8 -*-
"""DocumentFiles record"""
#-----------------------------------------------------------------------------
# Name:       documentfiles.py
# Purpose:
# Author:      Chris Hoy
# Created:     17/09/2014
# Copyright:   (c) 2014
#-----------------------------------------------------------------------------

from turbogears.database import  mapper, config
from sqlalchemy import Table, MetaData
import logging

LOGGER = logging.getLogger("prcommon")

class DocumentFiles(object):
	""" issuedocuments """
	pass

COLLATERALMETADATA = MetaData(config.get("prmaxcollateral.dburi"))
try:
	DocumentFiles.mapping = Table('documentfiles', COLLATERALMETADATA, autoload = True)
	mapper( DocumentFiles, DocumentFiles.mapping)
except:
	LOGGER.exception ( "No prmaxcollateral")
