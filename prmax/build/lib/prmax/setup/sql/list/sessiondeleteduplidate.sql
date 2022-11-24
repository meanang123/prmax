CREATE OR REPLACE FUNCTION sessiondeleteduplidate(p_userid integer, p_searchtypeid integer)
  RETURNS void
  AS $$

   import prmax.Constants as Constants
   if SD.has_key("plan_delete_session_duplicates"):
     plan_delete_session_duplicates = SD["plan_delete_session_duplicates"]
   else:
     plan_delete_session_duplicates = plpy.prepare("""select sessionsearchid, outletid from userdata.searchsession WHERE  userid = $1 AND searchtypeid = $2 AND outletid in ( select outletid from userdata.searchsession
			WHERE userid = $1 AND searchtypeid = $2 GROUP BY outletid HAVING COUNT(*)>1) order by outletid
			""",["int","int"])
     SD["plan_delete_session_duplicates"] = plan_delete_session_duplicates

   outletid = None
   deleterows = []
   for row in plpy.execute(plan_delete_session_duplicates,[p_userid,p_searchtypeid]):
     if row["outletid"] != outletid and not outletid:
       deleterows = deleterows[:-1]
     outletid  = row["outletid"]
     deleterows.append ( str(row["sessionsearchid"]) )
   if deleterows:
     deleterows = deleterows[:-1]


   if deleterows:
     command = "DELETE FROM userdata.searchsession WHERE sessionsearchid IN (" + ",".join(deleterows) + ")"
     plpy.execute(command)

 $$ LANGUAGE plpythonu;