# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

setup(
    name="prmaxutilities",
    version="1.0.0.1",
    description="Common Static Elements",
    author="Chris Hoy",
    author_email="chris.g.hoy@gmail.com",
    url="",
    #download_url=download_url,
    #icense=license,
    install_requires=[],
    zip_safe=False,
    keywords=[ ],
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Framework :: Chris'],
    packages=["prmaxutilities","prmaxutilities.dataload","prmaxutilities.dataload.data",
              "prmaxutilities.sql.research",
              "prmaxutilities.sql.accounting",
              "prmaxutilities.emailsender"],
	package_data = {"prmaxutilities.dataload.data":["*.*"],
                    "prmaxutilities.sql.research":["*.*"]},


    )
