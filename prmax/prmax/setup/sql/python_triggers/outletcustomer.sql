DROP FUNCTION IF EXISTS prmax_cache_outletcustomer() CASCADE;

-- if the customer outlet override have chnaged then delete the cache

CREATE OR REPLACE FUNCTION prmax_cache_outletcustomer ()
  RETURNS trigger
  AS $$

  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.caching import Invalidate_Cache_Object
  import prmax.Constants as Constants

  #control system
  controlSettings = PostGresControl(plpy)

  # do operation
  Invalidate_Cache_Object(plpy, SD, TD , Constants.Cache_Outlet_Objects)

$$ LANGUAGE plpythonu;

CREATE TRIGGER outletcustomers_add AFTER INSERT ON outletcustomers for each row EXECUTE PROCEDURE prmax_cache_outletcustomer();
CREATE TRIGGER outletcustomers_update AFTER UPDATE ON outletcustomers for each row EXECUTE PROCEDURE prmax_cache_outletcustomer();
CREATE TRIGGER outletcustomers_delete AFTER DELETE ON outletcustomers for each row EXECUTE PROCEDURE prmax_cache_outletcustomer();