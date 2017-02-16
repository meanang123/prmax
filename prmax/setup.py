# -*- coding: utf-8 -*-

from setuptools import setup, find_packages
from turbogears.finddata import find_package_data,\
     standard_exclude_directories

# build dojo release files
#from buildrelease.release_build import buildRelease
#buildRelease()

import os
execfile(os.path.join("prmax", "release.py"))

exclude_directories = ["dojo.dev","dojo.comp","dev","_doc","dojo.dev1.4","dojo.dev1.3"]+\
                    list(standard_exclude_directories)

packages=find_packages()
package_data = find_package_data(where='prmax',
    exclude_directories=exclude_directories,
    package='prmax')
if os.path.isdir('locales'):
    packages.append('locales')
    package_data.update(find_package_data(where='locales',
        exclude=('*.po',),
        only_in_packages=False))

setup(
    name="prmax",
    version="1.0.0.1",
    description="Prmax System",
    author="Chris Hoy",

    install_requires=[
        #"TurboGears == 1.1",
        #"SQLAlchemy >=0.5.0",
        #"psycopg2>=2.0.0",
        #"genshi>=0.0.4",
        #"slimmer>=0.1.22"
        # BeautifulSoup
        # reportlab
    ],
    zip_safe=False,
    packages=packages,
    package_data=package_data,
    keywords=[ ],
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Framework :: TurboGears',
    ],
    test_suite='nose.collector',
    entry_points = {
        'console_scripts': [
            'start-prmax = prmax.commands:start',
        ],
        'turbogears.extensions': ['prmax_control_extension = prmax.utilities.prlogger',],
    },
    # Uncomment next line and create a default.cfg file in your project dir
    # if you want to package a default configuration in your egg.
    #data_files = [('config', ['default.cfg'])],
    )
