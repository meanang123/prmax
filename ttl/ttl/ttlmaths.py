# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:         ttlmaths.py
# Purpose:
#
# Author:       Chris Hoy
#
# Created:      08/08/2011
# RCS-ID:       $Id:  $
# Copyright:    (c) 2011
# Licence:
#-----------------------------------------------------------------------------

def from_int(val, places=2):
	"""interger to float"""
	return float(val) / pow(10, places)

def from_int_ext(val, places=2):
	"""interger to float"""
	if val == None:
		return 0.0

	return float(val) / 100.00

def to_int(val, places=2):
	"""convert a float to integer """
	return int(round(round(val, places) * pow(10, places), 0))

# compatabily
def toInt(val, places=2):
	"""float """

	return to_int(val, places)
