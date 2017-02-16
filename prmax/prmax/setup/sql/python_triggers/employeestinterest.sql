DROP FUNCTION IF EXISTS prmax_employeeinterests_index() CASCADE;

CREATE OR REPLACE FUNCTION prmax_employeeinterests_index ()
  RETURNS trigger
  AS $$

  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.DBIndexer import StandardIndexer, getEmployeeOutletFind
  import prmax.Constants as Constants
  from prmax.utilities.caching import Invalidate_Cache_Object

  #control system
  controlSettings = PostGresControl(plpy)
  if controlSettings.isDisabled==1:
	return None
  controlSettings.doDebug(TD)

  # get plan for outlet find from employee
  plan_outlet = getEmployeeOutletFind(SD,plpy)

  # need to load contact surname at this point for the index
  outletid = None
  outlettypeid = None
  if TD.has_key("new") and TD['new'] and TD['new'].has_key('employeeid'):
	if TD['new']['employeeid']:
		data = TD['new']['outletid']= plpy.execute(plan_outlet, [TD['new']['employeeid'], ])[0]
		TD['new']['outletid']= outletid = data['outletid']
		outlettypeid = data['outlettypeid']
	else:
		TD['new']['outletid']= None

  if TD.has_key("old") and TD['old'] and TD['old'].has_key('employeeid'):
	if TD['old']['employeeid']:
		data = TD['old']['outletid']= plpy.execute(plan_outlet, [TD['old']['employeeid'], ])
		controlSettings.doDebug("getting employee")
		controlSettings.doDebug(data)
		controlSettings.doDebug(len(data))

		data = data[0]
		TD['old']['outletid']= outletid = data['outletid']
		controlSettings.doDebug("2")
		outlettypeid = data['outlettypeid']
	else:
		TD['old']['outletid']= None

  if outlettypeid==Constants.Outlet_Type_Freelance:
	  index_fields = ( ( Constants.freelance_employeeid_interestid,'interestid',None,None),  )
	  index_fields2 = ( ( Constants.freelance_outletid_interestid,'interestid',None,None),  )
  elif outlettypeid==Constants.Outlet_Type_Mp:
	  index_fields = ( ( Constants.mp_employeeid_interestid,'interestid',None,None),  )
	  index_fields2 = ( ( Constants.mp_outletid_interestid,'interestid',None,None),  )
  else:
	  index_fields = ( ( Constants.employee_employeeid_interestid,'interestid',None,None),  )
	  index_fields2 = ( ( Constants.employee_outletid_interestid,'interestid',None,None),  )


  # do indexing employeeid
  indexer = StandardIndexer(
  	SD,
  	plpy,
  	'employeeid',
  	TD,
  	index_fields,
  	controlSettings.getIndexRebuildMode())
  indexer.RunIndexer()

  #do outletid
  indexer.indexField = 'outletid'
  indexer.index_Fields = index_fields2
  indexer.RunIndexer()

  Invalidate_Cache_Object(plpy, SD, TD , Constants.Cache_Employee_Objects)

$$ LANGUAGE plpythonu;

CREATE TRIGGER employeeinterests_add AFTER INSERT ON employeeinterests for each row EXECUTE PROCEDURE prmax_employeeinterests_index();
CREATE TRIGGER employeeinterests_update AFTER UPDATE ON employeeinterests for each row EXECUTE PROCEDURE prmax_employeeinterests_index();
CREATE TRIGGER employeeinterests_delete AFTER DELETE ON employeeinterests for each row EXECUTE PROCEDURE prmax_employeeinterests_index();