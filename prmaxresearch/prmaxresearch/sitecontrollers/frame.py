# -*- coding: utf-8 -*-
"Research frame"
#-----------------------------------------------------------------------------
# Name:					frame.py
# Purpose:			controller for frame of research
#
#
# Author:      Chris Hoy
#
# Created:
# Copyright:   (c) 2012
#-----------------------------------------------------------------------------

from turbogears import expose, identity, validate, exception_handler
from ttl.tg.errorhandlers import pr_std_exception_handler
from ttl.tg.controllers import SecureControllerExt
from ttl.tg.validators import std_state_factory, PrFormSchema

class FrameController(SecureControllerExt):
	""" internal security user must be part of admin group """
	require = identity.in_group("dataadmin")

	@expose("json")
	@exception_handler(pr_std_exception_handler)
	@validate(validators=PrFormSchema(), state_factory=std_state_factory)
	def options(self, *args, **kw):
		""" data options"""

		return dict(identifier='id', label="name",
					  items=[
						  dict(id=1, type=1, name="Forms", children=
								[dict(_reference=12),
								 dict(_reference=3),
		             dict(_reference=18),
								 dict(_reference=20),
		             dict(_reference=24),
		             dict(_reference=26),
		             dict(_reference=34),
								 dict(_reference=5),
		             dict(_reference=36),
		             dict(_reference=39),
								 ]),
						  dict(id=12, type=3, name="Lookups", children=[
		            dict(_reference=2),
		            dict(_reference=11),
		            dict(_reference=10),
		            dict(_reference=8),
		            dict(_reference=15),
		            dict(_reference=25),
		            dict(_reference=29),
		            dict(_reference=30),
		            dict(_reference=31),
		            dict(_reference=68),
		            dict(_reference=69),
		            dict(_reference=32),
		            dict(_reference=33),
		            dict(_reference=41)
		            ]),
						  dict(id=2, type=0, name="Roles", content="research/lookups/Roles"),
		          dict(id=11, type=0, name="Geographical", content="research/lookups/Geographical"),
						  dict(id=10, type=0, name="Keywords", content="research/lookups/Interests"),
		          dict(id=8, type=0, name="Reason Codes", content="research/lookups/ReasonCodes"),
						  dict(id=15, type=0, name="People", content="research/employees/People"),
						  dict(id=3, type=3, name="Outlets", children=[
		            dict(_reference=6),
		            dict(_reference=7),
		            dict(_reference=14),
		            dict(_reference=16),
		            dict(_reference=70),
		            ]),
						  dict(id=6, type=0, name="Search & Edit", content="research/outlets/Outlets"),
						  dict(id=7, type=0, name="New Outlet", content="research/outlets/OutletNew"),
		          dict(id=70, type=0, name="New Organisation", content="research/organisation/organisationnew"),
		          dict(id=16, type=0, name="Outlet Delete Audit", content="research/audit/AuditDelete"),
						  dict(id=4, type=2, name="Logout of Prmax", page="/logout"),
						  dict(id=5, type=3, name="Logout", children=[dict(_reference=4)]),
						  dict(id=14, type=0, name="New Freelance", content="research/freelance/FreelanceNew"),
		          dict(id=18, type=3, name="Features", children=[dict(_reference=19)]),
		          dict(id=19, type=0, name="Search & Edit", content="research/advance/view"),
		          dict(id=20, type=3, name="Settings", children=[dict(_reference=21)]),
		          dict(id=21, type=0, name="Researcher", content="research/usersettings"),
		          dict(id=22, type=0, name="Bounced Emails", content="research/feedback/BouncedEmails"),
						  dict(id=24, type=3, name="Emails", children=[dict(_reference=22)]),
		          dict(id=25, type=0, name="Countries", content="research/lookups/Countries"),
		          dict(id=26, type=0, name="Projects", children=[dict(_reference=27), dict(_reference=28)]),
		          dict(id=27, type=0, name="View", content="research/projects/view"),
		          dict(id=28, type=0, name="Create", content="research/projects/create"),
		          dict(id=29, type=0, name="Publishers", content="research/lookups/Publishers"),
		          dict(id=30, type=0, name="Circulation Sources", content="research/lookups/CirculationSources"),
		          dict(id=31, type=0, name="Circulation Dates", content="research/lookups/CirculationDates"),
		          dict(id=68, type=0, name="Web Sources", content="research/lookups/WebSources"),
		          dict(id=69, type=0, name="Web Dates", content="research/lookups/WebDates"),
		          dict(id=32, type=0, name="Production Companies", content="research/lookups/ProductionCompanies"),
		          dict(id=33, type=0, name="Languages", content="research/lookups/Lanquages"),
		          dict(id=34, type=4, name="Reports", children=[dict(_reference=35),] ),
		          dict(id=35, type=0, name="Query", content="prcommon2/query/query"),
						  dict(id=36, type=3, name="International Data", children=[dict(_reference=37), dict(_reference=38)]),
		          dict(id=37, type=0, name="Subjects", content="research/translations/Subjects"),
		          dict(id=38, type=0, name="Translations", content="research/translations/translations"),
		          dict(id=39, type=3, name="Clippings", children=[dict(_reference=40),]),
		          dict(id=40, type=0, name="Clipping Outlets", content="research/clippings/linkoutlets")
		          ,dict(id=41, type=0, name="Deletion History", content="research/lookups/DeletionHistory")
		        ] )

