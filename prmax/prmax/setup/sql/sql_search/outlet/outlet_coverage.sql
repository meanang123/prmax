--
-- Coverage serach functions
--
--
CREATE OR REPLACE FUNCTION SearchCoverageAll(
    customerid INTEGER ,
    data text,
	byemployee boolean,
	logic integer
    )
  RETURNS bytea
  AS $$

  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.search import doIndexGroup
  from ttl.plpython import DBCompress

  import prmax.Constants as Constants

  criteria = DBCompress.decode(data)

  controlSettings = PostGresControl(plpy)
  controlSettings.doDebug(criteria)


  if SD.has_key("prmax_capture_cascade_level"):
	plan_list = SD["prmax_capture_cascade_level"]
  else:
	plan_list = plpy.prepare("SELECT geographicalrelationid FROM internal.geographicallookupcascade WHERE geographicalid = $1", [ "int"])
	SD['prmax_capture_cascade_level'] = plan_list

  list1 = [ (row, Constants.outlet_coverage) for row in criteria['data']]
  if criteria.get("cascade","")=="C":
    for row in criteria['data']:
	  for row1 in plpy.execute(plan_list,[row,]):
	    list1.append((row1['geographicalrelationid'], Constants.outlet_coverage))

  # conver data
  return DBCompress.encode( doIndexGroup (SD, plpy, False,
		Constants.Search_Or,
		list1,
		customerid))

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchCoverageAllCount(
    customerid INTEGER ,
    data text,
	byemployee boolean,
	logic integer
    )
  RETURNS int
  AS $$

  from prmax.utilities.search import doIndexGroup
  from ttl.plpython import DBCompress
  from prmax.utilities.postgres import PostGresControl

  controlSettings = PostGresControl(plpy)

  import prmax.Constants as Constants

  criteria = DBCompress.decode(data)

  if SD.has_key("prmax_capture_cascade_level"):
	plan_list = SD["prmax_capture_cascade_level"]
  else:
	plan_list = plpy.prepare("SELECT geographicalrelationid FROM internal.geographicallookupcascade WHERE geographicalid = $1", [ "int"])
	SD['prmax_capture_cascade_level'] = plan_list

  list1 = [ (row, Constants.outlet_coverage) for row in criteria['data']]
  if criteria.get("cascade","")=="C":
    for row in criteria['data']:
	  for row1 in plpy.execute(plan_list,[row,]):
	    list1.append((row1['geographicalrelationid'], Constants.outlet_coverage))

  controlSettings.doDebug(str(list1))
  # conver data
  return len(doIndexGroup (SD, plpy, False,
		Constants.Search_Or,
		list1,
		customerid))

$$ LANGUAGE plpythonu;
