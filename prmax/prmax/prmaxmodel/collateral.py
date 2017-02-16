# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:        collateral.py
# Purpose:	   Collateral interface, add update and delete user collaternal,
#				also check to see if the user has used up all the space.
#
# Author:      Chris Hoy
#
# Created:     25-05-2009
# RCS-ID:      $Id:  $
# Copyright:   (c) 2009

#-----------------------------------------------------------------------------

from prcommon.model import Collateral, ECollateral, CollateralIntgerests, \
     CollateralSpaceException
