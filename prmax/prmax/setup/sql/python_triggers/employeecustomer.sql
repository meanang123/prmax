DROP FUNCTION IF EXISTS prmax_cache_employeecustomers() CASCADE;

-- if the customer outlet override have chnaged then delete the cache

CREATE OR REPLACE FUNCTION prmax_cache_employeecustomers()
  RETURNS trigger
  AS $$

  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.caching import Invalidate_Cache_Object
  import prmax.Constants as Constants

  #control system
  controlSettings = PostGresControl(plpy)

  # do operation
  Invalidate_Cache_Object(plpy, SD, TD , Constants.Cache_Display_Employee)

$$ LANGUAGE plpythonu;

CREATE TRIGGER employeecustomers_add AFTER INSERT ON employeecustomers for each row EXECUTE PROCEDURE prmax_cache_employeecustomers();
CREATE TRIGGER employeecustomers_update AFTER UPDATE ON employeecustomers for each row EXECUTE PROCEDURE prmax_cache_employeecustomers();
CREATE TRIGGER employeecustomers_delete AFTER DELETE ON employeecustomers for each row EXECUTE PROCEDURE prmax_cache_employeecustomers();