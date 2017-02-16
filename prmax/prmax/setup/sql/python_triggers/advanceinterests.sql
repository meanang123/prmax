DROP FUNCTION IF EXISTS prmax_advancefeaturesinterests_index() CASCADE;

CREATE OR REPLACE FUNCTION prmax_advancefeaturesinterests_index ()
  RETURNS trigger
  AS $$

  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.DBIndexer import StandardIndexer
  from ttl.string import splitoutletname
  from prmax.utilities.search import encodeCirculation
  import prmax.Constants as Constants
  from prmax.utilities.caching import Invalidate_Cache_Object
  import prmax.Constants as Constants

  #control system
  controlSettings = PostGresControl(plpy)
  if controlSettings.isDisabled==1:
    return None
  controlSettings.doDebug(TD)

  index_Fields = (
    ( Constants.advance_interest,'interestid',None, None ) ,
    )

  # do indexing
  indexer = StandardIndexer(
	SD,
	plpy,
	'advancefeatureid',
	TD,
	index_Fields,
	controlSettings.getIndexRebuildMode())
  indexer.RunIndexer()

  # intert records ect
  #Invalidate_Cache_Object(plpy, SD, TD , Constants.Cache_Outlet_Objects)

$$ LANGUAGE plpythonu;



CREATE TRIGGER advancefeaturesinterests_add AFTER INSERT ON advancefeaturesinterests for each row EXECUTE PROCEDURE prmax_advancefeaturesinterests_index();
CREATE TRIGGER advancefeaturesinterests_update AFTER UPDATE ON advancefeaturesinterests for each row EXECUTE PROCEDURE prmax_advancefeaturesinterests_index();
CREATE TRIGGER advancefeaturesinterests_delete AFTER DELETE ON advancefeaturesinterests for each row EXECUTE PROCEDURE prmax_advancefeaturesinterests_index();
