# -*- coding: utf-8 -*-
"""employee synchronisation"""
#-----------------------------------------------------------------------------
# Name:        emplsynchroniser.py
# Purpose:     Synchronise employees in parent child outlets
#
# Author:      Stamatia Vatsi
#
# Created:     21/10/2016
# Copyright:  (c) 2016
#
#-----------------------------------------------------------------------------

import logging
import os
from turbogears import database
from turbogears.database import session
import prcommon.Constants as Constants

LOGGER = logging.getLogger("prcommon.model")
from ttl.tg.config import read_config

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.outlets.emplsynchronisation import EmployeeSynchronise
from prcommon.model.outlet import OutletProfile
from prcommon.model.research import ResearchDetails

def _run():
	""" run the application """

	childoutlets = session.query(OutletProfile).\
	    join(ResearchDetails, OutletProfile.outletid == ResearchDetails.outletid).\
	    filter(OutletProfile.seriesparentid != None).\
	    filter(ResearchDetails.no_sync == False ).all()

	results = []
	if childoutlets:
		for childoutlet in childoutlets:
			parent_allow_sync = session.query(OutletProfile).\
			    join(ResearchDetails, OutletProfile.outletid == ResearchDetails.outletid).\
			    filter(OutletProfile.outletid == childoutlet.seriesparentid).\
			    filter(ResearchDetails.no_sync == False).scalar()
			if (parent_allow_sync):
				resultdata = None
				try:
					sync = EmployeeSynchronise(childoutlet, True)
					resultdata = sync.synchronise_employees()
					if resultdata:
						results.append()
				except Exception, ex:
					results.append(str(ex))
		print results


if __name__ == '__main__':
	_run()
