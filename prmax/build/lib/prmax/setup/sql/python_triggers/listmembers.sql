DROP FUNCTION IF EXISTS list_members_trigger() CASCADE;
--
--
--

CREATE OR REPLACE FUNCTION list_members_trigger ()
  RETURNS trigger
  AS $$

  from prmax.utilities.postgres import PostGresControl
  controlSettings = PostGresControl(plpy)

  controlSettings.doDebug(TD)

  if SD.has_key("prmax_plan_list_members_trigger"):
    plan_update = SD["prmax_plan_list_members_trigger"]
  else:
    plan_update = plpy.prepare("UPDATE userdata.list SET update_time = CURRENT_TIMESTAMP WHERE listid = $1", [ "int",])

    SD["prmax_plan_list_members_trigger"] = plan_update

  # create index queue entries
  if TD["event"] in ( "INSERT" ,"UPDATE" ) :
  	listid = TD['new']['listid']
  elif TD["event"]=="DELETE":
  	listid = TD['old']['listid']
  else:
	listid = None

  if listid:
	plpy.execute(plan_update,[listid,])

$$ LANGUAGE plpythonu;

CREATE TRIGGER listmembers_add AFTER INSERT ON userdata.listmembers FOR EACH ROW EXECUTE PROCEDURE list_members_trigger();
CREATE TRIGGER listmembers_update AFTER UPDATE ON userdata.listmembers FOR EACH ROW EXECUTE PROCEDURE list_members_trigger();
CREATE TRIGGER listmembers_delete AFTER DELETE ON userdata.listmembers FOR EACH ROW EXECUTE PROCEDURE list_members_trigger();

