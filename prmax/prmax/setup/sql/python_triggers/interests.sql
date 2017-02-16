DROP FUNCTION IF EXISTS prmax_interests_build_words() CASCADE;

-- this handles the interest works
-- we need to handle the delete for the indexs as well

CREATE OR REPLACE FUNCTION prmax_interests_build_words ()
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
  from prcommon.lib.caching import Invalidate_Cache_Object_Interests
  import prmax.Constants as Constants

  if SD.has_key("plan_delete_interest"):
    plan_add = SD["prmax_interest_add_word"]
    plan_delete = SD["prmax_interest_delete_word"]
    plan_delete_all = SD["prmax_interest_delete_all_word"]
    plan_delete_interest = SD["prmax_interest_delete_interest"]
  else:
    plan_add = plpy.prepare("INSERT  INTO interestwords(interestword,interestid) VALUES($1,$2)", [ "text", "int",])
    plan_delete = plpy.prepare("DELETE  FROM interestwords WHERE interestword=$1 AND interestid=$2", [ "text", "int",])
    plan_delete_all = plpy.prepare("DELETE  FROM interestwords WHERE  interestid=$1", ["int",])
    plan_delete_interest = plpy.prepare("INSERT  INTO queues.indexerqueue(action,customerid,objecttype,objectid,data) VALUES($1,$2,$3,$4,$5)", [ "int", "int", "int", "int","bytea"])
    SD["prmax_interest_add_word"] = plan_add
    SD["prmax_interest_delete_word"] = plan_delete
    SD["prmax_interest_delete_all_word"] = plan_delete_all
    SD["prmax_interest_delete_interest"] = plan_delete_interest


  # create index queue entries
  if TD["event"]=="INSERT":
    for field in splitwords(unicode(TD['new']['interestname'].decode("utf8"))):
        plpy.execute(plan_add,[field,TD['new']['interestid']])
  elif TD["event"]=="UPDATE":
    (insertlist,deletelist) = splitwordscompare(TD['old']['interestname'], unicode(TD['new']['interestname']).decode("utf8"))

    controlSettings.doDebug ( "Insert " + str(insertlist))
    controlSettings.doDebug ( "Delete " + str(deletelist))
    for field in insertlist:
	plpy.execute(plan_add,[field,TD['new']['interestid']])
    for field in deletelist:
	plpy.execute(plan_delete,[field,TD['new']['interestid']])
  elif TD["event"]=="DELETE":
	plpy.execute(plan_delete_interest,[Constants.index_Delete,TD['old']['customerid'],Constants.outlet_interest,None,str(TD['old']['interestid'])])
	plpy.execute(plan_delete_interest,[Constants.index_Delete,TD['old']['customerid'],Constants.employee_employeeid_interestid,None,str(TD['old']['interestid'])])
	plpy.execute(plan_delete_interest,[Constants.index_Delete,TD['old']['customerid'],Constants.employee_outletid_interestid,None,str(TD['old']['interestid'])])
	plpy.execute(plan_delete_interest,[Constants.index_Delete,TD['old']['customerid'],Constants.freelance_employeeid_interestid,None,str(TD['old']['interestid'])])
	plpy.execute(plan_delete_interest,[Constants.index_Delete,TD['old']['customerid'],Constants.freelance_outletid_interestid,None,str(TD['old']['interestid'])])
	plpy.execute(plan_delete_interest,[Constants.index_Delete,TD['old']['customerid'],Constants.mp_employeeid_interestid,None,str(TD['old']['interestid'])])
	plpy.execute(plan_delete_interest,[Constants.index_Delete,TD['old']['customerid'],Constants.mp_outletid_interestid,None,str(TD['old']['interestid'])])
        plpy.execute(plan_delete_all,[TD['old']['interestid']])


  # need to delete all reference object for employee and outlets that might be cached

  Invalidate_Cache_Object_Interests(plpy, SD, TD, Constants.Cache_Display_Employee)
  Invalidate_Cache_Object_Interests(plpy, SD, TD, Constants.Cache_Display_Outlet)


$$ LANGUAGE plpythonu;

--DROP TRIGGER outlet_add ON outlets;
CREATE TRIGGER interest_add AFTER INSERT ON interests for each row EXECUTE PROCEDURE prmax_interests_build_words();
CREATE TRIGGER interest_update AFTER UPDATE ON interests for each row EXECUTE PROCEDURE prmax_interests_build_words();
CREATE TRIGGER interest_delete AFTER DELETE ON interests for each row EXECUTE PROCEDURE prmax_interests_build_words();