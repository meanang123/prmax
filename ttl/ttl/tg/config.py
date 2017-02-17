# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        common.py
# Purpose:
#
# Author:      Chris Hoy
#
# Created:     26-07-2010
# RCS-ID:      $Id:  $
# Copyright:   (c) 2010

#-----------------------------------------------------------------------------
import turbogears

from os.path import dirname, exists, join


def read_config(curdir,  args, modulename):
    """Read deployment configuration file.

    First looks on the command line for a desired config file, if it's not on
    the command line, then looks for 'setup.py' in the parent of the directory
    where this module is located.

    If 'setup.py' is there, assumes that the application is started from
    the project directory and should run in development mode and so loads the
    configuration from a file called 'dev.cfg' in the current directory.

    If 'setup.py' is not there, the project is probably installed and the code
    looks first for a file called 'prod.cfg' in the current directory and, if
    this isn't found either, for a default config file called 'default.cfg'
    packaged in the egg.

    """
    configfile = None
    if args:
        configfile = join(curdir, args[0])
    elif exists(join(curdir, "dev.cfg")):
        configfile = join(curdir, "dev.cfg")
    elif exists(join(curdir, "prod.cfg")):
        configfile = join(curdir, "prod.cfg")

    if modulename:
        modulename = modulename +".config"

    turbogears.update_config(configfile=configfile,
        modulename=modulename)