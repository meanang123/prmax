DROP FUNCTION sessiondeduplicate(p_userid integer, p_searchtypeid integer, deduplicateby text );

CREATE OR REPLACE FUNCTION sessiondeduplicate(p_userid integer, p_searchtypeid integer, deduplicateby text )
  RETURNS SETOF SearchSessionStatisticsExt
  AS $$
DECLARE

BEGIN

	-- OK if it's by outlet
	IF deduplicateby='O' THEN
		EXECUTE deduplicate_outlets(p_userid, p_searchtypeid);
	END IF;

	-- OK if it's by outlet
	IF deduplicateby='E' THEN
		EXECUTE deduplicate_employee(p_userid, p_searchtypeid);
	END IF;


	-- 1. determine it for duplidate
	-- 2. if outlet has primary then delete other
	-- 3. all the same just keep random one

	-- id its contact
	-- 1. determine the duplidate entries
	RETURN QUERY SELECT * from sessioncount(p_searchtypeid,p_userid);
  END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION deduplicate_outlets(p_userid integer, p_searchtypeid integer)
  RETURNS void
  AS $$

  from prmax.utilities.postgres import PostGresControl

  import prmax.Constants as Constants

  def _dodelete( employees ):
	# see if we have a primary contact?
	# yes then simplet delete others
	# no keey first in list and delete rest

	# do this with override id first
	deleterows = [ str(row['sessionsearchid']) for row in employees if row['employeeid'] != row['ocprimaryemployeeid']]
	if len(deleterows)==len(employees):
		deleterows = [ str(row['sessionsearchid']) for row in employees if row['employeeid'] != row['primaryemployeeid']]
	if len(deleterows)==len(employees):
		deleterows = deleterows[1:]
	if deleterows:
		command = "DELETE FROM userdata.searchsession WHERE sessionsearchid IN (" + ",".join(deleterows) + ")"
		plpy.execute(command)

  if SD.has_key("plan_deduplicate_outlets_list"):
    plan_deduplicate_outlets_list = SD["plan_deduplicate_outlets_list"]
  else:
    plan_deduplicate_outlets_list = plpy.prepare("""select u.outletid,u.employeeid,o.primaryemployeeid,u.sessionsearchid,oc.primaryemployeeid as ocprimaryemployeeid
		FROM userdata.searchsession as u
		JOIN outlets as o ON o.outletid = u.outletid
		LEFT OUTER JOIN outletcustomers AS oc ON u.outletid = oc.outletid AND oc.customerid = u.customerid
		WHERE
			u.outletid IN ( select ss2.outletid from userdata.searchsession as ss2 WHERE ss2.userid = $1 AND ss2.searchtypeid = $2 GROUP BY ss2.outletid HAVING COUNT(*)>1)  AND
		u.userid = $1 AND u.searchtypeid = $2
		ORDER BY outletid""", [ "int", "int",])
    SD['plan_deduplicate_outlets_list'] = plan_deduplicate_outlets_list


  outletid = -1
  outletemployeemap = []

  for row in plpy.execute(plan_deduplicate_outlets_list,[p_userid,p_searchtypeid]):
	if outletid != row['outletid']:
		# at this point we need to do deleye
		if len(outletemployeemap)>0:
			_dodelete(outletemployeemap)
		outletemployeemap = [ ]
		outletid = row['outletid']
	outletemployeemap.append ( row )


  if len(outletemployeemap)>0:
	_dodelete(outletemployeemap)

 $$ LANGUAGE plpythonu;

 ------------------------------------------------------------------------------
 --
 --
 ------------------------------------------------------------------------------

 CREATE OR REPLACE FUNCTION deduplicate_employee(p_userid integer, p_searchtypeid integer)
  RETURNS void
  AS $$

  from prmax.utilities.postgres import PostGresControl
  import prmax.Constants as Constants

  def _dodelete( employees ):
	# see if we have a primary contact?
	# yes then simplet delete others
	# no keey first in list and delete rest

	# do this with override id first
	deleterows = [ str(row['sessionsearchid']) for row in employees ]
	deleterows = deleterows[1:]
	command = "DELETE FROM userdata.searchsession WHERE sessionsearchid IN (" + ",".join(deleterows) + ")"
	plpy.execute(command)

  if SD.has_key("plan_deduplicate_outlets_list"):
    plan_deduplicate_employee_list = SD["plan_deduplicate_employee_list"]
  else:
    plan_deduplicate_employee_list = plpy.prepare("""select COALESCE ( u.employeeid, oc.primaryemployeeid, o.primaryemployeeid) AS primaryemployeeid, u.sessionsearchid
		FROM userdata.searchsession as u
		JOIN outlets as o ON o.outletid = u.outletid
		LEFT OUTER JOIN outletcustomers AS oc ON u.outletid = oc.outletid AND oc.customerid = u.customerid
		WHERE
			u.outletid IN ( SELECT
						COALESCE ( u.employeeid, oc.primaryemployeeid, o.primaryemployeeid) as ocprimaryemployeeid
						FROM userdata.searchsession as u
						JOIN outlets as o ON o.outletid = u.outletid
						LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = u.outletid AND oc.customerid = u.customerid
						WHERE
							u.userid = $1 AND searchtypeid = $2
						GROUP BY ocprimaryemployeeid
						HAVING COUNT(*)>1)
			AND
			u.userid = $1 AND searchtypeid = $2
			ORDER BY employeeid""", [ "int", "int",])
    SD['plan_deduplicate_employee_list'] = plan_deduplicate_employee_list


  employeeid = -1
  outletemployeemap = []

  for row in plpy.execute(plan_deduplicate_employee_list,[p_userid,p_searchtypeid]):
	if employeeid != row['ocprimaryemployeeid']:
		# at this point we need to do deleye
		if len(outletemployeemap)>0:
			_dodelete(outletemployeemap)
		outletemployeemap = [ ]
		employeeid = row['ocprimaryemployeeid']
	outletemployeemap.append ( row )

  if len(outletemployeemap)>0:
	_dodelete(outletemployeemap)

 $$ LANGUAGE plpythonu;