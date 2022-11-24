DROP FUNCTION IF EXISTS prmax_employeesubjects_index() CASCADE;

CREATE OR REPLACE FUNCTION prmax_employeesubjects_index ()
  RETURNS trigger
  AS $$
  # need to insert into interest
  # subject to interst
  from prmax.utilities.postgres import PostGresControl

  controlSettings = PostGresControl(plpy)
  controlSettings.doDebug(TD)

  if SD.has_key("prmax_employee_subject_interest_find"):
		plan_list = SD["prmax_employee_subject_interest_find"]
		plan_insert = SD["prmax_employee_subject_interest_add"]
		plan_delete= SD["prmax_employee_subject_interest_delete"]
		plan_exists = SD["prmax_employee_subject_interest_exists"]
  else:
        plan_list = plpy.prepare("SELECT interestid FROM interestsubjects WHERE subjectid = $1", [ "int"])
        plan_insert = plpy.prepare("INSERT  INTO employeeinterests(employeeid,interestid) VALUES($1,$2)", [ "int", "int"])
        plan_delete= plpy.prepare("DELETE FROM employeeinterests WHERE employeeid=$1 AND interestid=$2", [ "int", "int"])
        plan_exists = plpy.prepare("SELECT employeeid FROM employeeinterests WHERE employeeid = $1 AND interestid = $2", [ "int", "int"])
        
        SD["prmax_employee_subject_interest_find"] = plan_list
        SD["prmax_employee_subject_interest_add"] = plan_insert
        SD["prmax_employee_subject_interest_delete"] = plan_delete
        SD["prmax_employee_subject_interest_exists"] = plan_exists

  if TD["event"]=="INSERT":
	results = plpy.execute(plan_list,[TD['new']['subjectid']])
	for row in results:
		exists = plpy.execute(plan_exists,[TD['new']['employeeid'],row['interestid']])
		if len(exists)==0:
			plpy.execute(plan_insert,[TD['new']['employeeid'],row['interestid']])

  elif TD["event"]=="UPDATE":
        # this should happend
        pass
  elif TD["event"]=="DELETE":
        for row in plpy.execute(plan_list,[TD['old']['subjectid']]):
            plpy.execute(plan_delete,[TD['old']['employeeid'],row['interestid']])

$$ LANGUAGE plpythonu;

CREATE TRIGGER employeesubjects_add AFTER INSERT ON employeesubjects for each row EXECUTE PROCEDURE prmax_employeesubjects_index();
CREATE TRIGGER employeesubjects_update AFTER UPDATE ON employeesubjects for each row EXECUTE PROCEDURE prmax_employeesubjects_index();
CREATE TRIGGER employeesubjects_delete AFTER DELETE ON employeesubjects for each row EXECUTE PROCEDURE prmax_employeesubjects_index();