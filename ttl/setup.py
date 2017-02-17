# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

setup(
    name="ttl",
    version="1.0.0.1",
    description="Common Controls",
    author="Chris Hoy",
    author_email="chris.g.hoy@gmail.com",
    url="",
    install_requires=[],
    zip_safe=False,
    keywords=[ ],
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Framework :: Chris'],
    packages=['ttl',
              'ttl.imovo',
              "ttl.report",
              "ttl.tg",
              "ttl.postgres",
              "ttl.labels",
              "ttl.msword",
              "ttl.model",
              "ttl.sitecontrollers",
              "ttl.Const",
              "ttl.mysql",
              "ttl.password",
              "ttl.seleniumext",
              "ttl.sqlalchemy"],
    package_data = {
      'ttl.report':['resources/*.gif','resources/*.jpg','resources/*.png'],
      "ttl":["static/rel/images/*.*"]},
    entry_points="""
      [python.templating.engines]
      ttlmakoext = ttl.ttlmako:TGMakoExtPlugin
      """,
    )
