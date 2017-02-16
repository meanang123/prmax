DROP FUNCTION IF EXISTS prmax_contact_index() CASCADE;

CREATE OR REPLACE FUNCTION prmax_contact_index ()
  RETURNS trigger
  AS $$
  
  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.DBIndexer import StandardIndexer
  import prmax.Constants as Constants
  
  #control system 
  controlSettings = PostGresControl(plpy)
  if controlSettings.isDisabled==1:
	return None    
 

$$ LANGUAGE plpythonu;

CREATE TRIGGER contact_add AFTER INSERT ON contacts for each row EXECUTE PROCEDURE prmax_contact_index();
CREATE TRIGGER contact_update AFTER UPDATE ON contacts for each row EXECUTE PROCEDURE prmax_contact_index();
CREATE TRIGGER contact_delete AFTER DELETE ON contacts for each row EXECUTE PROCEDURE prmax_contact_index();