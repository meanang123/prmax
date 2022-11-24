DROP FUNCTION IF EXISTS prmax_outletinterests_index() CASCADE;

CREATE OR REPLACE FUNCTION prmax_outletinterests_index ()
  RETURNS trigger
  AS $$

  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.caching import Invalidate_Cache_Object
  from prmax.utilities.DBIndexer import StandardIndexer, getOutletFind
  import prmax.Constants as Constants

  #control system
  controlSettings = PostGresControl(plpy)
  if controlSettings.isDisabled==1:
	return None
  controlSettings.doDebug(TD)

  plan_1 = getOutletFind(SD,plpy)
  # need to get the outlet details and determine what it is
  if TD["event"]=="INSERT":
	outlettypeid = plpy.execute(plan_1,[TD['new']['outletid']])[0]['outlettypeid']
  elif TD["event"] in ("UPDATE","DELETE"):
	outlettypeid = plpy.execute(plan_1,[TD['old']['outletid']])[0]['outlettypeid']

  if not outlettypeid in Constants.Outlet_Is_Individual:
	  # do indexing
	index_fields = ( ( Constants.outlet_interest,'interestid',None,None),  )

	indexer = StandardIndexer(
		SD,
		plpy,
		'outletid',
		TD,
		index_fields,
		controlSettings.getIndexRebuildMode())
	indexer.RunIndexer()

  # invalid the cache
  Invalidate_Cache_Object(plpy, SD, TD , Constants.Cache_Display_Outlet)


$$ LANGUAGE plpythonu;

CREATE TRIGGER outletinterests_add AFTER INSERT ON outletinterests for each row EXECUTE PROCEDURE prmax_outletinterests_index();
CREATE TRIGGER outletinterests_update AFTER UPDATE ON outletinterests for each row EXECUTE PROCEDURE prmax_outletinterests_index();
CREATE TRIGGER outletinterests_delete AFTER DELETE ON outletinterests for each row EXECUTE PROCEDURE prmax_outletinterests_index();