# -*- coding: utf-8 -*-

from turbogears import database
import os
from ttl.tg.config import read_config

# initiale interface to tg to get at data model
read_config(os.getcwd(), None, None)
# connect to database
database.bind_meta_data()

from prcommon.model.cyberwatch.cyberwatchgeneral import CyberWatchGeneral

CyberWatchGeneral.do_test_search()
