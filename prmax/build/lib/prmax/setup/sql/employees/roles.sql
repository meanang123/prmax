--
CREATE OR REPLACE FUNCTION Reapplyroles() returns boolean  AS $$
BEGIN
	DELETE FROM employeeprmaxroles;
	DELETE FROM cache.cachestore where objecttypeid = 2 ;
	DELETE FROM employeeinterests WHERE customerid = -1 AND sourceid = 2 ;
	DELETE FROM userdata.setindex WHERE keytypeid IN(119,120);

	PERFORM SETVAL('employeeprmaxroles_employeeprmaxroleid_seq', 1);
	INSERT INTO employeeprmaxroles(outletid,employeeid,prmaxroleid)
		SELECT e.outletid, employeeid, prmaxroleid from employees as e
			JOIN internal.prmaxroles as pr ON e.job_title = pr.prmaxrole
			JOIN outlets as o ON o.outletid = e.outletid
		WHERE o.outlettypeid NOT in ( 19, 40 ) AND pr.visible = true AND e.customerid = -1 AND e.prmaxstatusid = 1 ;

	INSERT INTO employeeprmaxroles(outletid,employeeid,prmaxroleid)
		SELECT e.outletid, employeeid, prs.parentprmaxroleid from employees as e
			JOIN internal.prmaxroles as pr ON e.job_title = pr.prmaxrole
			JOIN internal.prmaxrolesynonyms as prs ON prs.childprmaxroleid = pr.prmaxroleid
			JOIN internal.prmaxroles as pr2 ON prs.parentprmaxroleid = pr2.prmaxroleid
			JOIN outlets as o ON o.outletid = e.outletid
		WHERE o.outlettypeid NOT in ( 19, 40 ) AND pr2.visible = true AND o.customerid = -1 AND e.customerid = -1 AND e.prmaxstatusid = 1;

	return TRUE ;
  END;
$$ LANGUAGE plpgsql;
