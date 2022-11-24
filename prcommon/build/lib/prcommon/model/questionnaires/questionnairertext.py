# -*- coding: utf-8 -*-
"research Projects"
#-----------------------------------------------------------------------------
# Name:        projects.py
# Purpose:     Research Project Details
# Author:      Chris Hoy
#
# Created:     09/09/2011
# RCS-ID:      $Id:  $
# Copyright:   (c) 2011

#-----------------------------------------------------------------------------
from turbogears.database import  metadata, mapper, session
from sqlalchemy import Table, not_
from sqlalchemy.sql import text, func
from prcommon.model import BaseSql, SearchSession
from prcommon.model.research import ResearchControRecord,  ResearchDetails
from prcommon.model.lookups import  ResearchProjectStatus
from prcommon.model.identity import User
from ttl.ttldate import to_json_date

import datetime
import prcommon.Constants as Constants

import logging
LOGGER = logging.getLogger("prmax.model")

class QuestionnaireText(BaseSql):
	""" Research Projects """
	pass

#########################################################
## Map object to db
#########################################################

QuestionnaireText.mapping = Table('questionnairetext', metadata, autoload = True, schema='research')

mapper(QuestionnaireText, QuestionnaireText.mapping)