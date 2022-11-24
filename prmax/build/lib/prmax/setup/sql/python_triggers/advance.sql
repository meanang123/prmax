DROP FUNCTION IF EXISTS prmax_advance_index() CASCADE;

CREATE OR REPLACE FUNCTION prmax_advance_index ()
  RETURNS trigger
  AS $$

  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.DBIndexer import StandardIndexer
  from ttl.string import splitoutletname2
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
    ( Constants.advance_search_name,'feature',splitoutletname2, StandardIndexer.restictoutletindex ) ,
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



CREATE TRIGGER advancefeature_add AFTER INSERT ON advancefeatures for each row EXECUTE PROCEDURE prmax_advance_index();
CREATE TRIGGER advancefeature_update AFTER UPDATE ON advancefeatures for each row EXECUTE PROCEDURE prmax_advance_index();
CREATE TRIGGER advancefeature_delete AFTER DELETE ON advancefeatures for each row EXECUTE PROCEDURE prmax_advance_index();
