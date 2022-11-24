DROP FUNCTION IF EXISTS prmax_outletcoverage_index() CASCADE;

CREATE OR REPLACE FUNCTION prmax_outletcoverage_index ()
  RETURNS trigger
  AS $$

  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.DBIndexer import StandardIndexer, getOutletFind
  import prmax.Constants as Constants

  #control system
  controlSettings = PostGresControl(plpy)
  if controlSettings.isDisabled==1:
	return None
  controlSettings.doDebug(TD)
  
  plan_1 = getOutletFind(SD,plpy)  
  # do indexing
  index_fields = ( ( Constants.outlet_coverage,'geographicalid',None,None),  )
  
  indexer = StandardIndexer(
		SD,
		plpy,
		'outletid',
		TD,
		index_fields,
		controlSettings.getIndexRebuildMode())
  indexer.RunIndexer()

$$ LANGUAGE plpythonu;

CREATE TRIGGER outletcoverage_add AFTER INSERT ON outletcoverage for each row EXECUTE PROCEDURE prmax_outletcoverage_index();
CREATE TRIGGER outletcoverage_update AFTER UPDATE ON outletcoverage for each row EXECUTE PROCEDURE prmax_outletcoverage_index();
CREATE TRIGGER outletcoverage_delete AFTER DELETE ON outletcoverage for each row EXECUTE PROCEDURE prmax_outletcoverage_index();