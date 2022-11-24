DROP FUNCTION IF EXISTS prmax_prmaxroles_build_words() CASCADE;

-- this handles the prmaxroles
-- we need to handle the delete for the indexs as well

CREATE OR REPLACE FUNCTION prmax_prmaxroles_build_words ()
  RETURNS trigger
  AS $$

  #control
  from prmax.utilities.postgres import PostGresControl
  from prmax.utilities.caching import Invalidate_Cache_Object
  import prmax.Constants as Constants

  #control system
  controlSettings = PostGresControl(plpy)
  if controlSettings.isDisabled==1:
	return None

  controlSettings.doDebug(TD)

  # rest of functions
  from ttl.string import splitwords,splitwordscompare
  import prmax.Constants as Constants

  if SD.has_key("plan_delete_interest"):
    plan_add = SD["prmax_interest_add_word"]
    plan_delete = SD["prmax_interest_delete_word"]
    plan_delete_all = SD["prmax_interest_delete_all_word"]
    plan_delete_interest = SD["prmax_interest_delete_interest"]
  else:
    plan_add = plpy.prepare("INSERT  INTO internal.prmaxrolewords(word,prmaxroleid) VALUES($1,$2)", [ "text", "int",])
    plan_delete = plpy.prepare("DELETE  FROM internal.prmaxrolewords WHERE word=$1 AND prmaxroleid=$2", [ "text", "int",])
    plan_delete_all = plpy.prepare("DELETE  FROM internal.prmaxrolewords WHERE  prmaxroleid=$1", ["int",])
    SD["prmax_interest_add_word"] = plan_add
    SD["prmax_interest_delete_word"] = plan_delete
    SD["prmax_interest_delete_all_word"] = plan_delete_all

  # create index queue entries
  if TD["event"]=="INSERT" and TD['new']['visible']:
    for field in splitwords(TD['new']['prmaxrole']):
        plpy.execute(plan_add,[field,TD['new']['prmaxroleid']])
  elif TD["event"]=="UPDATE":
    # this is equiv of a new
	if TD['new']['visible'] and not TD['old']['visible']:
           for field in splitwords(TD['old']['prmaxrole']):
               plpy.execute(plan_add,[field,TD['old']['prmaxroleid']])
	# this is equiv to a delete
	if not TD['new']['visible']:
	    plpy.execute(plan_delete_all,[TD['old']['prmaxroleid']])

	# update
	if TD['new']['visible'] and TD['new']['visible'] == TD['old']['visible']:
	    (insertlist,deletelist) = splitwordscompare(TD['old']['prmaxrole'],TD['new']['prmaxrole'])
            for word in insertlist:
               plpy.execute(plan_add,[ word , TD['new']['prmaxroleid']])
            for word in deletelist:
               plpy.execute(plan_delete,[ word , TD['new']['prmaxroleid']])
  elif TD["event"]=="DELETE":
	plpy.execute(plan_delete_all,[TD['old']['prmaxroleid']])



$$ LANGUAGE plpythonu;

CREATE TRIGGER prmaxroles_add AFTER INSERT ON internal.prmaxroles for each row EXECUTE PROCEDURE prmax_prmaxroles_build_words();
CREATE TRIGGER prmaxroles_update AFTER UPDATE ON internal.prmaxroles for each row EXECUTE PROCEDURE prmax_prmaxroles_build_words();
CREATE TRIGGER prmaxroles_delete AFTER DELETE ON internal.prmaxroles for each row EXECUTE PROCEDURE prmax_prmaxroles_build_words();