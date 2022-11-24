# -*- coding: utf-8 -*-
#-----------------------------------------------------------------------------
# Name:
# Purpose:     07/07/2008
#
# Author:       --<>
#
# Created:
# RCS-ID:        $Id:  $
# Copyright:   (c) 2008

#-----------------------------------------------------------------------------

CIRCULATIONRANGE = (
	(1, '1-500', 1, 500),
	(2, '501-2500', 501, 2500),
	(3, '2501-10k', 2501, 10000),
	(4, '10001-50k', 10001, 50000),
	(5, '50001-100k', 50001, 100000),
	(6, '100001+', 100001, 4294967295),
	(0, '', 0, 0))

def encodecirculation(circulation):
	" Encode the cirucation into a search type"
	for row in CIRCULATIONRANGE:
		if circulation >= row[2] and circulation <= row[3]:
			return row[0]
	return 0
