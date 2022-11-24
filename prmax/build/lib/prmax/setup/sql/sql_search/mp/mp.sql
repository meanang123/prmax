CREATE OR REPLACE FUNCTION doMpSearch( commandtext bytea)
  RETURNS SETOF SearchResult
  AS $$

  import cPickle
  import  prmax.Constants as Constants
  from base64 import b64decode
  from ttl.plpython import DBCompress
  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.DBIndexer import IndexEntry

  commands = cPickle.loads(b64decode(commandtext))

  controlSettings = PostGresControl(plpy)

  levellists = []
  overallResult = None
  for command in commands.rows:
	indexItems = ",".join(["('%s',%d)::IndexElement"%(value,command.keytypeid)
								for value in command.word])
	controlSettings.doDebug(indexItems);
	result = plpy.execute( """select * from doIndexGroup( ARRAY[%s], %d,%d,%d);"""%(indexItems, commands.customerid,command.logic,command.partial))[0]

	levellists.append(DBCompress.decode(result['doindexgroup']))

  if len(levellists)==1:
      overallResult = levellists[0]
  else:
	for rowData in levellists:
		if overallResult==None:
		    overallResult = levellists[0]
		    continue
		if command.logic==Constants.Search_And:
			overallResult.index.intersection_update(rowData.index)
			if len(overallResult.index)==0:
				break
		elif logic==Constants.Search_Or:
			overallResult.index.union_update(rowData.index)

  controlSettings.doDebug("Outletdata  " + str(type(overallResult)))
  controlSettings.doDebug("Outletdata  " + str(overallResult))

  return [(None,employeeid) for employeeid in overallResult.index]
$$ LANGUAGE plpythonu;
