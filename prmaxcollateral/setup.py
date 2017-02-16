# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

setup(
    name="prmaxcollateral",
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
    packages=["collateral",
               'collateral.images',
              'collateral.movies',
              'collateral.powerpoint',
              'collateral.newsletters',
              'collateral.pdf',
              'collateral.html',
              'collateral.faq',
              'collateral.newsletters.1',
              'collateral.newsletters.2',
              'collateral.newsletters.2.images'],
	package_data = {'collateral.movies':['*.*'],
                  'collateral.images':['*.*'],
                  'collateral.powerpoint':['*.*'],
                  'collateral.newsletters':["*.*"],
                  'collateral.html':["*.*"],
                  'collateral.pdf':["*.*"],
                  'collateral.faq': ["*.*"],
                  'collateral.newsletters':["*."],
                  'collateral.newsletters.1':["*.*"],
                  'collateral.newsletters.2':["*.*"],
                  'collateral.newsletters.2.images':["*.*"]},
    )
