-- this is a function to return a list of id's for a give index allows the index
-- to be direclty accessed by the sql
CREATE OR REPLACE FUNCTION getSet( p_keytypeid int ,  p_keyname text   , p_customerid int )
  RETURNS bytea
  AS $$

  from prmax.utilities.DBHelper import DBUtilities
  from ttl.plpython import DBCompress
  from prmax.utilities.DBIndexer import IndexEntry

  # need to conver and return data at this point
  # add sql here to capture data
  if SD.has_key("prmax_index_get"):
    plan = SD["prmax_index_get"]
  else:
    plan = plpy.prepare("SELECT data,keyname FROM setindex WHERE customerid=$1 AND keytypeid=$2 AND keyname=$3",[ "int", "int", "text"])
    SD["prmax_index_get"] = plan

  rowPublic  = plpy.execute(plan, [ -1,p_keytypeid,DBUtilities.formatsearchword(p_keyname,False)])
  rowPrivate =  plpy.execute(plan, [ p_customerid,p_keytypeid,DBUtilities.formatsearchword(p_keyname,False)])

  rowOut = None
  if len(rowPublic):
    rowOut = DBCompress.decode(rowPublic[0]['data'])
  if len(rowPrivate):
    index = DBCompress.decode(rowPrivate[0]['data'])
    if rowOut:
      rowOut.index.union_update(index.index)
    else:
      rowOut = index

  return DBCompress.encode(rowOut)

$$ LANGUAGE plpythonu;



CREATE OR REPLACE FUNCTION SetToIdList( data text )
  RETURNS SETOF SetResultList
  AS $$

  # need to conver and return data at this point

  from ttl.plpython import DBCompress


  index =  DBCompress.decode(data)

  return [ (dataid,) for dataid in index.index]

$$ LANGUAGE plpythonu;

CREATE OR REPLACE FUNCTION getSetToIdList( p_keytypeid int ,  p_keyname text   , p_customerid int )
  RETURNS SETOF SetResultList
  AS $$

  from prmax.utilities.DBHelper import DBUtilities
  from ttl.plpython import DBCompress
  from prmax.utilities.DBIndexer import IndexEntry


  # need to conver and return data at this point
  # add sql here to capture data
  if SD.has_key("prmax_index_get"):
    plan = SD["prmax_index_get"]
  else:
    plan = plpy.prepare("SELECT data,keyname FROM setindex WHERE customerid=$1 AND keytypeid=$2 AND keyname=$3",[ "int", "int", "text"])
    SD["prmax_index_get"] = plan

  rowPublic  = plpy.execute(plan, [ -1,p_keytypeid,DBUtilities.formatsearchword(p_keyname,False)])
  rowPrivate =  plpy.execute(plan, [ p_customerid,p_keytypeid,DBUtilities.formatsearchword(p_keyname,False)])

  rowOut = None
  if len(rowPublic):
    rowOut = DBCompress.decode(rowPublic[0]['data'])
  if len(rowPrivate):
    index = DBCompress.decode(rowPrivate[0]['data'])
    if rowOut:
      rowOut.index.union_update(index.index)
    else:
      rowOut = index

  if rowOut:
    return [ (dataid,) for dataid in rowOut.index]
  else:
    return []

$$ LANGUAGE plpythonu;

CREATE OR REPLACE FUNCTION EmployeeAddOutletTree( data text  )
  RETURNS bytea
  AS $$

  # get a set of outletids for a set of employeeid
  if SD.has_key("prmax_employee_to_outlet_sql"):
    plan = SD["prmax_employee_to_outlet_sql"]
  else:
      plan = plpy.prepare("SELECT e.employeeid,e.outletid FROM SetToIdList($1) as ls JOIN employees as e ON ls.dataid = e.employeeid",["text",])
      SD['prmax_employee_to_outlet_sql'] = plan
  # need to conver and return data at this point

  from prmax.utilities.DBHelper import DBUtilities
  from ttl.plpython import DBCompress
  from prmax.utilities.DBIndexer import IndexEntry

  index = IndexEntry()
  for dataRow in plpy.execute(plan, [ data]):
    index.index.add(dataRow['employeeid'])
    index.tree[dataRow['employeeid']] = dataRow['outletid']

  return DBCompress.encode(index)

$$ LANGUAGE plpythonu;



CREATE OR REPLACE FUNCTION EmployeeToOutlet( data text  )
  RETURNS bytea
  AS $$

  # get a set of outletids for a set of employeeid
  if SD.has_key("prmax_employee_to_outlet_sql"):
    plan = SD["prmax_employee_to_outlet_sql"]
  else:
      plan = plpy.prepare("SELECT e.employeeid,e.outletid FROM SetToIdList($1) as ls JOIN employees as e ON ls.dataid = e.employeeid",["text",])
      SD['prmax_employee_to_outlet_sql'] = plan
  # need to conver and return data at this point

  from prmax.utilities.DBHelper import DBUtilities
  from ttl.plpython import DBCompress
  from prmax.utilities.DBIndexer import IndexEntry

  index = IndexEntry()
  for dataRow in plpy.execute(plan, [ data]):
    index.index.add(dataRow['outletid'])
    index.tree[dataRow['employeeid']] = dataRow['outletid']

  return DBCompress.encode(index)

$$ LANGUAGE plpythonu;

CREATE OR REPLACE FUNCTION OutletToPrimaryEmployee( data text  )
  RETURNS bytea
  AS $$

  # get a set of outletids for a set of employeeid
  if SD.has_key("prmax_outlet_to_employee_sql"):
    plan = SD["prmax_outlet_to_employee_sql"]
  else:
      plan = plpy.prepare("SELECT o.outletid,o.primaryemployeeid as employeeid FROM SetToIdList($1) as ls JOIN outlets as o ON ls.dataid = o.outletid",["text",])
      SD['prmax_outlet_to_employee_sql'] = plan

  from prmax.utilities.DBHelper import DBUtilities
  from ttl.plpython import DBCompress
  from prmax.utilities.DBIndexer import IndexEntry

  index = IndexEntry()
  for dataRow in plpy.execute(plan, [ data]):
    index.index.add(dataRow['employeeid'])
    index.tree[dataRow['employeeid']] = dataRow['outletid']

  return DBCompress.encode(index)

$$ LANGUAGE plpythonu;

