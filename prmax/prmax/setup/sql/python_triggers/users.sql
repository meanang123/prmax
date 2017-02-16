DROP FUNCTION IF EXISTS prcomm_add_session_record() CASCADE;

CREATE OR REPLACE FUNCTION prcomm_add_session_record()
  RETURNS trigger
  AS $$
  if SD.has_key("insert_user_session_1"):
    plan_1 = SD["insert_user_session_1"]
    plan_2 = SD["insert_user_advance_2"]
  else:
    plan_1 = plpy.prepare("INSERT INTO internal.user_session(userid) VALUES($1)", [ "int"])
    plan_2 = plpy.prepare("INSERT INTO userdata.advancefeatureslist(userid,customerid,advancefeatureslistdescription,advancefeatureslisttypeid) VALUES($1,$2,'Search Results',2)", ["int","int"])
    SD["insert_user_session_1"] = plan_1
    SD["insert_user_advance_2"] = plan_2

  if TD["event"]=="INSERT":
    plpy.execute(plan_1,[TD['new']['user_id']])
    plpy.execute(plan_2,[TD['new']['user_id'],TD['new']['customerid']])

$$ LANGUAGE plpythonu;

CREATE TRIGGER user_add AFTER INSERT ON tg_user for each row EXECUTE PROCEDURE prcomm_add_session_record();