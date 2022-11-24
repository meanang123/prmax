CREATE OR REPLACE FUNCTION doEmployeeSearch( commandtext bytea)
  RETURNS SETOF SearchResult
  AS $$

  import cPickle
  from types import StringType
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
	controlSettings.doDebug(type(command.keytypeid))
	if type(command.keytypeid)==StringType:
		action = """select * from %s( %d,'%s',true,%d);"""%(command.keytypeid, commands.customerid,command.word,command.logic)
		result = plpy.execute(action)[0]
		itemkey = command.keytypeid.lower()
	else:
		indexItems = ",".join(["('%s',%d)::IndexElement"%(value,command.keytypeid)
								for value in command.word])
		result = plpy.execute( """select * from doIndexGroup( ARRAY[%s], %d,%d,%d);"""%(indexItems, commands.customerid,command.logic,command.partial))[0]
		itemkey = "doindexgroup"

	levellists.append(DBCompress.decode(result[itemkey]))

  controlSettings.doDebug(levellists)
  controlSettings.doDebug(command.logic)
  if len(levellists)==1:
      overallResult = levellists[0]
  else:
	for rowData in levellists:
		if overallResult==None:
			overallResult = levellists[0]
			continue
		overallResult.index.intersection_update(rowData.index)
		if len(overallResult.index)==0:
			controlSettings.doDebug("b")
			break

  return [(None,employeeid) for employeeid in overallResult.index]

$$ LANGUAGE plpythonu;
