# -*- coding: utf-8 -*-
"""
		This module contains the controller classes of the application.
"""

# symbols which are imported by "from prmaxresearch.controllers import *"
__all__ = ['Root']

# third-party imports
from turbogears import controllers, expose, view
from cherrypy import response
from prmaxquestionnaires.model import QuestionnairesGeneral
from prcommon.model import Outlet
from prcommon.lib.common import add_config_details
from prcommon.sitecontrollers.open import OpenController

from prmaxquestionnaires.sitecontrollers.questionnaires import QuestionnaireidController
from prmaxquestionnaires.sitecontrollers.languages import OpenLangaugeController
from prmaxquestionnaires.sitecontrollers.interests import OpenInterestController
from prmaxquestionnaires.sitecontrollers.search import SearchController



import logging
LOGGER = logging.getLogger("prmaxquestionnaires")

class Root(controllers.RootController):
	"""
		The root controller of the application.
	"""
	common = OpenController()
	questionnaire = QuestionnaireidController()
	lanquages = OpenLangaugeController()
	interests = OpenInterestController()
	search = SearchController()

	@expose("")
	def default(self, *args, **params):
		""" logs missing pages and handles the questionairres"""

		response.headers["Content-type"] = "text/html;charset=utf-8"

		if args and args[0].lower() == "robots.txt":
			return """User-agent: *
			Disallow: all"""

		if len(args) == 2 and args[1] == "quest":
			ret = add_config_details({})
			ret["questionnaireid"] = int(args[0])
			questionnaire = QuestionnairesGeneral.is_valid(ret["questionnaireid"])
			if questionnaire != None:
				ret["questionnaire"] = questionnaire
				ret["outlet"] = Outlet.query.get(questionnaire.outletid)
				template = "prmaxquestionnaires.templates.main"
			else:
				template = "prmaxquestionnaires.templates.no_questionnaire"

			return view.render(ret, template=template)

		LOGGER.error("**** MISSING COMMAND *****\nInfo : %s ", dict(args=args, params=params))
		return ""
