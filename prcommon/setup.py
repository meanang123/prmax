# -*- coding: utf-8 -*-

from setuptools import setup, find_packages
from ttl.build import CompressDetails
import os

from turbogears.finddata import find_package_data, \
     standard_exclude_directories

EXCLUDEDIRECTORIES = ["dev", "comp", "dev"] + list(standard_exclude_directories)

PACKAGEDATA = find_package_data(where = 'prcommon',
    exclude_directories = EXCLUDEDIRECTORIES,
    package = 'prcommon')

tmp = os.getcwd()
CompressDetails ( os.path.join(tmp,"prcommon/static/dev"),
                  os.path.join(tmp,"prcommon/static/rel"),
                  "prcommon")

setup(
    name="prcommon",
    version="1.0.0.1",
    description="PrmaxCommon Controls",
    author="Chris Hoy",
    author_email="chris.hoy@prmax.co.uk",
    url="",
    install_requires=[],
    zip_safe=False,
    keywords=[ ],
    classifiers=[
        'Development Status :: 3 - Released',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Framework :: Chris'],
    packages=['prcommon',
              'prcommon.postgressearch',
              "prcommon.model",
              "prcommon.model.accounts",
              "prcommon.model.apis",
              "prcommon.model.clippings",
              "prcommon.model.clippings.output",
              "prcommon.model.crm2",
              "prcommon.model.customer",
              "prcommon.model.cyberwatch",
              "prcommon.model.datafeeds",
              "prcommon.model.distribution",
              "prcommon.model.exports",
              "prcommon.model.journorequests",
              "prcommon.model.researchprojects",
              "prcommon.model.mediatoolkit",
              "prcommon.model.madaptive",
              "prcommon.model.newsroom",
              "prcommon.model.outlets",
              "prcommon.model.partners",
              "prcommon.model.researchext",
              "prcommon.model.sales",
              "prcommon.model.search",
              "prcommon.model.solidmedia",
              "prcommon.model.general",
              "prcommon.model.questionnaires",
              "prcommon.Const",
              "prcommon.sitecontrollers",
              "prcommon.sitecontrollers.crm",
              "prcommon.sitecontrollers.distribution",
              "prcommon.research",
              "prcommon.research.questionnaires",
              "prcommon.accounts",
              "prcommon.accounts.reporting",
              "prcommon.sales",
              "prcommon.sales.salesorderconformation",
              "prcommon.lib",
              "prcommon.setup",
              "prcommon.utilities",
              "prcommon.utilities.programs",
              "prcommon.utilities.programs.services"],
    package_data = PACKAGEDATA
    )
