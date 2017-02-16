DROP FUNCTION IF EXISTS prmax_geographical_build_words() CASCADE;

-- this handles the geographical works
-- we need to handle the delete for the indexs as well

CREATE OR REPLACE FUNCTION prmax_geographical_build_words ()
  RETURNS trigger
  AS $$

  #control
  from prmax.utilities.postgres import PostGresControl
  import prmax.Constants as Constants

  #control system
  controlSettings = PostGresControl(plpy)
  if controlSettings.isDisabled==1:
	return None

  controlSettings.doDebug(TD)

  # rest of functions
  from ttl.string import splitwords,splitwordscompare
  import prmax.Constants as Constants

  if SD.has_key("prmax_plan_delete_indexs"):
    plan_add = SD["prmax_geographical_add_word"]
    plan_delete = SD["prmax_geographical_delete_word"]
    plan_delete_all = SD["prmax_geographical_delete_all_word"]
    plan_is_valid = SD["prmax_geographical_is_valid"]
    plan_delete_indexs = SD["prmax_plan_delete_indexs"]
    plan_cascade = SD["prmax_plan_plan_cascade"]
  else:
    plan_add = plpy.prepare("INSERT  INTO internal.geographicalwords(geographicalword,geographicalid) VALUES($1,$2)", [ "text", "int",])
    plan_delete = plpy.prepare("DELETE  FROM internal.geographicalwords WHERE geographicalword=$1 AND geographicalid=$2", [ "text", "int",])
    plan_delete_all = plpy.prepare("DELETE  FROM internal.geographicalwords WHERE  geographicalid=$1", ["int",])
    plan_is_valid = plpy.prepare("SELECT geographicalid FROM internal.geographicallookup WHERE  geographicalid=$1", ["int",])
    plan_delete_indexs = plpy.prepare("DELETE  FROM userdata.setindex WHERE  keytypeid=50 AND keyname=$1", ["text"])
    plan_cascade = plpy.prepare("SELECT create_geographical_cascade($1)",["int"])

    SD["prmax_geographical_add_word"] = plan_add
    SD["prmax_geographical_delete_word"] = plan_delete
    SD["prmax_geographical_delete_all_word"] = plan_delete_all
    SD["prmax_geographical_is_valid"] = plan_is_valid
    SD["prmax_plan_delete_indexs"] = plan_delete_indexs
    SD["prmax_plan_plan_cascade"] = plan_cascade

  # create index queue entries
  if TD["event"]=="INSERT":
  	plpy.execute(plan_cascade,[TD['new']['geographicalid']])
	exists = plpy.execute(plan_is_valid,[TD['new']['geographicalid']])
	if exists:
		for field in splitwords(TD['new']['geographicalname']):
			plpy.execute(plan_add,[field,TD['new']['geographicalid']])
  elif TD["event"]=="UPDATE":
	plpy.execute(plan_cascade,[TD['new']['geographicalid']])
	exists = plpy.execute(plan_is_valid,[TD['new']['geographicalid']])
	if exists:
		(insertlist,deletelist) = splitwordscompare(TD['old']['geographicalname'],TD['new']['geographicalname'])
		for field in insertlist:
			plpy.execute(plan_add,[field,TD['new']['geographicalid']])
		for field in deletelist:
			plpy.execute(plan_delete,[field,TD['new']['geographicalid']])
  elif TD["event"]=="DELETE":
        plpy.execute(plan_delete_all,[TD['old']['geographicalid']])
        plpy.execute(plan_delete_indexs,[str(TD['old']['geographicalid'])])

  # need to delete all reference object for employee and outlets that might be cached

$$ LANGUAGE plpythonu;

CREATE TRIGGER geographical_add AFTER INSERT ON internal.geographical for each row EXECUTE PROCEDURE prmax_geographical_build_words();
CREATE TRIGGER geographical_update AFTER UPDATE ON internal.geographical for each row EXECUTE PROCEDURE prmax_geographical_build_words();
CREATE TRIGGER geographical_delete AFTER DELETE ON internal.geographical for each row EXECUTE PROCEDURE prmax_geographical_build_words();



--
DROP FUNCTION IF EXISTS prmax_geographicallookup() CASCADE;
--
--

CREATE OR REPLACE FUNCTION prmax_geographicallookup ()
  RETURNS trigger
  AS $$

  #control
  from prmax.utilities.postgres import PostGresControl
  import prmax.Constants as Constants

  #control system
  controlSettings = PostGresControl(plpy)
  if controlSettings.isDisabled==1:
	return None

  controlSettings.doDebug(TD)

  if SD.has_key("prmax_geographical_get_lookup"):
    plan_add = SD["prmax_geographical_get_lookup"]
    plan_add = SD["prmax_geographical_add_word"]
    plan_delete = SD["prmax_geographical_delete_word"]
    plan_delete_all = SD["prmax_geographical_delete_all_word"]
    plan_get_geog = SD["prmax_geographical_get_lookup"]
  else:
    plan_add = plpy.prepare("INSERT  INTO internal.geographicalwords(geographicalword,geographicalid) VALUES($1,$2)", [ "text", "int",])
    plan_delete = plpy.prepare("DELETE  FROM internal.geographicalwords WHERE geographicalword=$1 AND geographicalid=$2", [ "text", "int",])
    plan_delete_all = plpy.prepare("DELETE  FROM internal.geographicalwords WHERE  geographicalid=$1", ["int",])
    plan_get_geog = plpy.prepare("SELECT geographicalname FROM internal.geographical WHERE  geographicalid=$1", ["int",])
    SD["prmax_geographical_add_word"] = plan_add
    SD["prmax_geographical_delete_word"] = plan_delete
    SD["prmax_geographical_delete_all_word"] = plan_delete_all
    SD["prmax_geographical_get_lookup"] = plan_get_geog


  from ttl.string import splitwords,splitwordscompare
  import prmax.Constants as Constants

  if TD["event"]=="INSERT":
	area = plpy.execute(plan_get_geog,[TD['new']['geographicalid']])[0]
	for field in splitwords(area['geographicalname']):
		plpy.execute(plan_add,[field,TD['new']['geographicalid']])
  elif TD["event"]=="UPDATE":
	pass
  elif TD["event"]=="DELETE":
        plpy.execute(plan_delete_all,[TD['old']['geographicalid']])

$$ LANGUAGE plpythonu;



CREATE TRIGGER geographicallookup_add AFTER INSERT ON internal.geographicallookup for each row EXECUTE PROCEDURE prmax_geographicallookup();
CREATE TRIGGER geographicallookup_update AFTER UPDATE ON internal.geographicallookup for each row EXECUTE PROCEDURE prmax_geographicallookup();
CREATE TRIGGER geographicallookup_delete AFTER DELETE ON internal.geographicallookup for each row EXECUTE PROCEDURE prmax_geographicallookup();
