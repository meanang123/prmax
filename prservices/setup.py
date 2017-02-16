# -*- coding: utf-8 -*-
# the aim is to more report build etc into here
from setuptools import setup

setup(
    name="prservices",
    version="1.0.0.1",
    description="Background PRmax Services",
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
    packages=['prservices',
              "prservices.clippings",
              "prservices.clipsearch",
              "prservices.crontab",
              "prservices.housekeeping",
              "prservices.prtwitter",
              "prservices.prappserver",
              "prservices.prindexer",
              "prservices.intdataloader",
              "prservices.oneoffs",
              "prservices.prquestdist",
              "prservices.premailcheck",
              "prservices.prexport",
              "prservices.primport",
              "prservices.primport.stamm",
              "prservices.primport.stamm.utils",
              "prservices.primport.usa",
              "prservices.primport.usa.utils",
              "prservices.primport.nijgh",
              "prservices.primport.nijgh.utils",
              "prservices.emplsynchronise",
              "prservices.unsubscribe",
              "prservices.bouncemails"
              ],
    package_data = {}
    )
