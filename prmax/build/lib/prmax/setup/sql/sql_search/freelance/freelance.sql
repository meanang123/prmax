CREATE OR REPLACE FUNCTION doFreelanceSearch( commandtext bytea)
  RETURNS SETOF SearchResult
  AS $$
  import  prmax.Constants as Constants
  from ttl.plpython import DBCompress
  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.search import doCommonSearch

  commands = DBCompress.decode(commandtext)
  logic=Constants.Search_And

  controlSettings = PostGresControl(plpy)

  overallResult = None
  levellists= doCommonSearch(commands, plpy, True  )
  controlSettings.doDebug("Level")
  controlSettings.doDebug(levellists)

  if len(levellists[Constants.Search_Data_Employee])==1:
	overallResult = levellists[Constants.Search_Data_Employee][0]
  else:
	for rowData in levellists[Constants.Search_Data_Employee]:
		if overallResult==None:
			overallResult = rowData
			continue
		if logic==Constants.Search_And:
			controlSettings.doDebug("P1")
			controlSettings.doDebug(overallResult.index)
			overallResult.index.intersection_update(rowData.index)
			if len(overallResult.index)==0:
				break
			controlSettings.doDebug("P2")
		elif logic==Constants.Search_Or:
			overallResult.index.union_update(rowData.index)

  return [(None,employeeid) for employeeid in overallResult.index]

$$ LANGUAGE plpythonu;
