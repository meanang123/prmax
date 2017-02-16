# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:		caching.py
# Purpose:     common database function for caching
#
# Author:       Chris Hoy
#
# Created:	20/03/2009
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

import prcommon.Constants as Constants
from types import TupleType

from prcommon.lib.caching import Invalidate_Cache_Object, \
     Invalidate_Cache_Object_Interests, Invalidate_Cache_Object_Research
