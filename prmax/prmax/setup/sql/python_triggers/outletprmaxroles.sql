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

  # invalid the cache
  Invalidate_Cache_Object(plpy, SD, TD , Constants.Cache_Employee_Objects)

$$ LANGUAGE plpythonu;

CREATE TRIGGER outletprmaxroles_add AFTER INSERT ON employeeprmaxroles for each row EXECUTE PROCEDURE prmax_outletprmaxroles_index();
CREATE TRIGGER outletprmaxroles_update AFTER UPDATE ON employeeprmaxroles for each row EXECUTE PROCEDURE prmax_outletprmaxroles_index();
CREATE TRIGGER outletprmaxroles_delete AFTER DELETE ON employeeprmaxroles for each row EXECUTE PROCEDURE prmax_outletprmaxroles_index();
