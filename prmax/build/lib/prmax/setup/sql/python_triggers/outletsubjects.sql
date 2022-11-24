DROP FUNCTION IF EXISTS prmax_outletsubjects_index() CASCADE;

CREATE OR REPLACE FUNCTION prmax_outletsubjects_index ()
  RETURNS trigger
  AS $$
  # need to insert into interest
  # subject to interst
  from prmax.utilities.postgres import PostGresControl
  controlSettings = PostGresControl(plpy)
  controlSettings.doDebug(TD)

  if SD.has_key("prmax_subject_interest_outlet_control"):
    plan_list = SD["prmax_subject_interest_find"]
    plan_insert = SD["prmax_subject_interest_add"]
    plan_delete = SD["prmax_subject_interest_delete"]
    plan_exists = SD["prmax_subject_interest_exists"]
    plan_control = SD["prmax_subject_interest_outlet_control"]
  else:
    plan_list = plpy.prepare("SELECT interestid FROM interestsubjects WHERE subjectid = $1", [ "int"])
    plan_exists = plpy.prepare("SELECT outletinterestid FROM outletinterests WHERE outletid = $1 AND interestid = $2", [ "int", "int"])
    plan_insert = plpy.prepare("INSERT  INTO outletinterests(outletid,interestid) VALUES($1,$2)", [ "int", "int"])
    plan_delete= plpy.prepare("DELETE FROM outletinterests WHERE outletid=$1 AND interestid=$2", [ "int", "int"])
    plan_list = plpy.prepare("SELECT interestid FROM interestsubjects WHERE subjectid = $1", [ "int"])
    plan_control = plpy.prepare("SELECT interests_by_prmax FROM internal.research_control_record WHERE objectid = $1 AND objecttypeid = 1", [ "int"])

    SD["prmax_subject_interest_find"] = plan_list
    SD["prmax_subject_interest_add"] = plan_insert
    SD["prmax_subject_interest_delete"] = plan_delete
    SD["prmax_subject_interest_exists"] = plan_exists
    SD["prmax_subject_interest_outlet_control"] = plan_control

  outletid = None
  if TD["event"]=="INSERT":
    outletid = TD['new']['outletid']
  elif TD["event"]=="DELETE":
    outletid = TD['old']['outletid']

  # interest are controlled by prmax ignore subjects
  control = plpy.execute(plan_control,[outletid,])
  if control and control[0]["interests_by_prmax"]:
    return

  controlSettings.doDebug("a")
  if TD["event"]=="INSERT":
	results = plpy.execute(plan_list,[TD['new']['subjectid']])
	for row in results:
		exists  = plpy.execute(plan_exists,[TD['new']['outletid'],row['interestid']])
		if len(exists)==0:
			plpy.execute(plan_insert,[TD['new']['outletid'],row['interestid']])

  elif TD["event"]=="UPDATE":
	# this should happend
	pass
  elif TD["event"]=="DELETE":
	for row in plpy.execute(plan_list,[TD['old']['subjectid']]):
		plpy.execute(plan_delete,[TD['old']['outletid'],row['interestid']])

$$ LANGUAGE plpythonu;

CREATE TRIGGER outletsubjects_add AFTER INSERT ON outletsubjects for each row EXECUTE PROCEDURE prmax_outletsubjects_index();
CREATE TRIGGER outletsubjects_update AFTER UPDATE ON outletsubjects for each row EXECUTE PROCEDURE prmax_outletsubjects_index();
CREATE TRIGGER outletsubjects_delete AFTER DELETE ON outletsubjects for each row EXECUTE PROCEDURE prmax_outletsubjects_index();