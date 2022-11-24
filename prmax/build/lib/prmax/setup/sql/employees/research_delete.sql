CREATE OR REPLACE FUNCTION employee_research_force_delete(p_employeeid integer)
  RETURNS void AS
  $$
BEGIN

-- remove all links from the fixed lists
UPDATE userdata.listmembers SET employeeid = NULL
	FROM userdata.list AS l WHERE l.listid = userdata.listmembers.listid AND listtypeid = 2 AND userdata.listmembers.employeeid = p_employeeid AND l.fixed = true ;

-- removes any link left int the standard lists
DELETE FROM userdata.listmembers WHERE employeeid = p_employeeid;

-- make sure no interests;
DELETE FROM employeeinterests where employeeid = p_employeeid;
-- make sure no job roles
DELETE FROM employeeprmaxroles where employeeid = p_employeeid;
-- remove employee links from fixed distribution list
UPDATE userdata.listmembers SET employeeid = NULL
	FROM userdata.list AS l WHERE l.listid = userdata.listmembers.listid AND listtypeid = 2 AND userdata.listmembers.employeeid = p_employeeid AND l.fixed = true ;
-- remove references
UPDATE outletcustomers SET primaryemployeeid = NULL WHERE primaryemployeeid = p_employeeid;

-- now do the delete
EXECUTE employee_type_delete( p_employeeid ) ;


END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;