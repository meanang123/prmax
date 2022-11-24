CREATE OR REPLACE FUNCTION doQuickSearch( commandtext bytea)
  RETURNS SETOF SearchResult
  AS $$

  from types import StringType
  import  prmax.Constants as Constants
  from prmax.utilities.DBHelper import DBUtilities
  from ttl.plpython import DBCompress
  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.DBIndexer import IndexEntry
  from prmax.utilities.search import doCommonSearch

  controlSettings = PostGresControl(plpy)

  commands = DBCompress.decode(commandtext)
  logic = Constants.Search_And

  overallResult = [None,None,None]
  levellists = doCommonSearch(commands, plpy )

  controlSettings.doDebug("Post common")

  for typ in Constants.Search_Data_Types:
	controlSettings.doDebug("Len1 = " + str(typ) + " "+ str(levellists[typ]))
	if len(levellists[typ])==1:
		overallResult[typ] = levellists[typ][0]
	else:
		for rowData in levellists[typ]:
			if overallResult[typ]==None:
				overallResult[typ] = rowData
				continue
			if logic==Constants.Search_And:
				overallResult[typ].index.intersection_update(rowData.index)
				# need to combine the tree
				overallResult[typ].tree = dict(rowData.tree)
				controlSettings.doDebug("Len2 = " + str(overallResult.index))

				if len(overallResult[typ].index)==0:
					break
			elif logic==Constants.Search_Or:
				overallResult[typ].index.union_update(rowData.index)
				tr = dict()
				for (key,data) in rowData.tree:
					tr[key] = data
				for (key,data) in overallResult[typ]:
					tr[key] = data
				overallResult[typ].tree = tr

  controlSettings.doDebug("result" + str(overallResult))

  if overallResult[Constants.Search_Data_Outlet] != None and overallResult[Constants.Search_Data_Employee] != None :
		# has both types
		employee = overallResult[Constants.Search_Data_Employee]
		controlSettings.doDebug("Len3 = " + str(employee.tree))
		if  len(employee.tree)==0 and len(employee.index)>0:
			employee.tree = DBUtilities.employeeindextooutlettree(employee,SD,plpy)
		outlet   = overallResult[Constants.Search_Data_Outlet]
		controlSettings.doDebug("Outlet = " + str(outlet.index))
		controlSettings.doDebug("employee.index = " + str(employee.index))
		controlSettings.doDebug("employee.tree = " + str(employee.tree))
		return [(employee.tree[employeeid],employeeid) for employeeid in employee.index  if employee.tree[employeeid] in outlet.index]

  elif overallResult[Constants.Search_Data_Outlet] != None  and overallResult[Constants.Search_Data_Employee] == None :
	# has outlets only
		controlSettings.doDebug("outlets Only")
		return [(outletid,None) for outletid in overallResult[Constants.Search_Data_Outlet].index]

  elif overallResult[Constants.Search_Data_Outlet] == None  and overallResult[Constants.Search_Data_Employee] != None :
	# has employees only
		controlSettings.doDebug("employees Only")
		return [(None,employeeid) for employeeid in overallResult[Constants.Search_Data_Employee].index]
  else:
		controlSettings.doDebug("Problem with options")
		return []


$$ LANGUAGE plpythonu;
