#!c:\Projects\tg15env\Scripts\python.exe
# -*- coding: utf-8 -*-
"""Start script for the prmaxquestionnaires TurboGears project.

This script is only needed during development for running from the project
directory. When the project is installed, easy_install will create a
proper start script.
"""

import sys
from prmaxquestionnaires.command import start, ConfigurationError

if __name__ == '__main__':
    try:
        start()
    except ConfigurationError, exc:
        sys.stderr.write(str(exc))
        sys.exit(1)
