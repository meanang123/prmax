# -*- coding: utf-8 -*-
""" prpublish common functions """
#-----------------------------------------------------------------------------
# Name:        common.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     12/10/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------

from turbogears.database import config
from prcommon.model import SEOCategories

LOCALSETTINGS = None

def page_settings_basic():
	""" get the standard fields for a page """

	global LOCALSETTINGS

	if not LOCALSETTINGS:
		LOCALSETTINGS = dict(
		  prodpath=config.get('prpublish.prodpath', 'rel'),
		  prpublish=dict(version=config.get('prpublish.version', ''),
		                   copyright=config.get('prpublish.copyright', '')),
		  localpath=config.get('prpublish.localpath', ''),
		  categories=SEOCategories.get_list())

	return LOCALSETTINGS

