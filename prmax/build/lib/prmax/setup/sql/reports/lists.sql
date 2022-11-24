-- function to return a list of all the projects for a list
CREATE OR REPLACE FUNCTION list_projects(
listid int
)
  RETURNS text
  AS $$
  projects = ""
  if SD.has_key("prmax_list_projects"):
    plan = SD["prmax_list_projects"]
  else:
    plan = plpy.prepare("SELECT p.projectname FROM userdata.projectmembers as pm JOIN userdata.projects as p ON p.projectid = pm.projectid WHERE pm.listid = $1 ORDER BY p.projectname",["int"])
    SD['prmax_list_projects'] = plan

  data = plpy.execute(plan, [listid])
  if data:
    projects = ",".join([ row['projectname'] for row in data])
    
  return projects

$$ LANGUAGE plpythonu;
