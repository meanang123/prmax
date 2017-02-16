# -*- coding: utf-8 -*-
import os
from datetime import datetime
import logging
from turbogears import database
from ttl.tg.config import read_config
from ttl.ttlenv import getEnvironment

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.lib.unsubscribeemails import AnalysisMessages

level = logging.INFO
logging.basicConfig(level=level)
log = logging.getLogger()

# get the environment
testEnvironment = getEnvironment()
if testEnvironment is None:
    exit(-1)

try:
    log.info("Processed Started: %s" % datetime.now())

    a = AnalysisMessages(log, testEnvironment)
    nbr = a.run()
    log.info("Processed %d at %s" % (nbr, datetime.now()))

except Exception, e:
    log.info("Processed Failed %s" % str(e))
