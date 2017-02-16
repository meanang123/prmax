 DROP FUNCTION IF EXISTS prmax_outletprmaxroles_index() CASCADE;

CREATE OR REPLACE FUNCTION prmax_outletprmaxroles_index ()
  RETURNS trigger
  AS $$

  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.caching import Invalidate_Cache_Object
  from prmax.utilities.DBIndexer import StandardIndexer
  import prmax.Constants as Constants

  #control system
  controlSettings = PostGresControl(plpy)
  if controlSettings.isDisabled==1:
    return None
  if SD.has_key("prmax_employee_prmax_roles_index"):
		plan_list = SD["prmax_employee_prmax_roles_index"]
		plan_interest_insert = SD["prmax_interest_prmax_role_insert"]
		plan_interest_delete = SD["prmax_plan_interest_delete"]
  else:
		plan_list = plpy.prepare("SELECT COUNT(*) AS count FROM employeeprmaxroles WHERE outletid = $1 AND prmaxroleid = $2", [ "int", "int"])
		plan_interest_insert = plpy.prepare("""INSERT INTO employeeinterests (employeeid, interestid, sourceid, outletid, employeeprmaxroleid )
					SELECT epr.employeeid, pri.interestid,2,epr.outletid,epr.employeeprmaxroleid FROM employeeprmaxroles AS epr
					JOIN internal.prmaxroleinterests AS pri ON epr.prmaxroleid = pri.prmaxroleid
					WHERE  pri.interestid NOT IN (SELECT interestid FROM employeeinterests WHERE employeeid = epr.employeeid) AND epr.employeeprmaxroleid = $1""", ["int"] )

		plan_interest_delete = plpy.prepare("""DELETE FROM employeeinterests WHERE interestid IN
					( SELECT interestid FROM internal.prmaxroleinterests WHERE employeeprmaxroleid = $1 ) AND
						employeeid = $2 AND sourceid = 2""", ["int","int"] )

		SD["prmax_employee_prmax_roles_index"] = plan_list
		SD["prmax_interest_prmax_role_insert"] = plan_interest_insert
		SD["prmax_plan_interest_delete"] = plan_interest_delete

  controlSettings.doDebug(TD)

  index_employee_fields = ( ( Constants.employee_job_role,'prmaxroleid',None,None),  )
  index_outlet_fields = ( ( Constants.outlet_job_role,'prmaxroleid',None,None),  )

  controlSettings.doDebug("abc")


  if TD["event"] in ( "INSERT", "UPDATE" ) :
		controlSettings.doDebug("i1")
		indexer = StandardIndexer(
				SD,
				plpy,
				'outletid',
				TD,
				index_outlet_fields,
				controlSettings.getIndexRebuildMode())
		indexer.RunIndexer()

		indexer = StandardIndexer(
				SD,
				plpy,
				'employeeid',
				TD,
				index_employee_fields,
				controlSettings.getIndexRebuildMode())
		indexer.RunIndexer()

  elif TD["event"] in ("DELETE",):
	indexer = StandardIndexer(
			SD,
			plpy,
			'employeeid',
			TD,
			index_employee_fields,
	controlSettings.getIndexRebuildMode())
	indexer.RunIndexer()

	# delete an outlet only when the count for outlets = 0
	if TD['old']['outletid'] != None:
		tmp = plpy.execute(plan_list,[TD['old']['outletid'],TD['old']['prmaxroleid']])

		if tmp[0]["count"] < 1 :
			indexer = StandardIndexer(
				SD,
				plpy,
				'outletid',
				TD,
				index_outlet_fields,
				controlSettings.getIndexRebuildMode())
			indexer.RunIndexer()

	# delete the employee interests
	tmp = plpy.execute(plan_interest_delete,[TD['old']['employeeprmaxroleid'],TD['old']['employeeid']])

  # at this point we need to deal with the interests for this specific role
  # UPDATE can be ignored
  # DELETE should be coped withby the cascading deletes
  if TD["event"] == "INSERT" :
	controlSettings.doDebug("abc")
	plpy.execute(plan_interest_insert,[TD['new']['employeeprmaxroleid']])

  # invalid the cache
  Invalidate_Cache_Object(plpy, SD, TD , Constants.Cache_Employee_Objects)

$$ LANGUAGE plpythonu;

CREATE TRIGGER outletprmaxroles_add AFTER INSERT ON employeeprmaxroles for each row EXECUTE PROCEDURE prmax_outletprmaxroles_index();
CREATE TRIGGER outletprmaxroles_update AFTER UPDATE ON employeeprmaxroles for each row EXECUTE PROCEDURE prmax_outletprmaxroles_index();
CREATE TRIGGER outletprmaxroles_delete AFTER DELETE ON employeeprmaxroles for each row EXECUTE PROCEDURE prmax_outletprmaxroles_index();
