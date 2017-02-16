INSERT INTO internal.prmaxroles(prmaxrole) select job_title from employees GROUP BY job_title;
	INSERT INTO employeeprmaxroles(outletid,employeeid,prmaxroleid)

SELECT outletid, employeeid, prmaxroleid from employees as e JOIN internal.prmaxroles as pr ON e.job_title = pr.prmaxrole JOIN outlets as o ON o.outletid = e.outletid WHERE o.outlettypeid NOT in ( 19, 40 )