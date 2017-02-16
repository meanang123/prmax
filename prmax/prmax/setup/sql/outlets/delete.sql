CREATE OR REPLACE FUNCTION outlet_delete ( p_outletid integer)
RETURNS void AS $$

BEGIN

-- remove links
UPDATE userdata.listmembers SET outletid = NULL
	FROM userdata.list AS l WHERE l.listid = userdata.listmembers.listid AND listtypeid = 2 AND userdata.listmembers.outletid = p_outletid AND l.fixed = true ;

-- Delete the components of an outlet
-- need process to delete no-used contacts
DELETE FROM outletcustomers WHERE outletid = p_outletid;
UPDATE outlets SET primaryemployeeid = NULL WHERE outletid = p_outletid;
DELETE FROM employeeinterests where employeeid IN ( SELECT employeeid FROM employees WHERE outletid = p_outletid );

-- Needs to run correct delete sequence
PERFORM employee_research_force_delete(employeeid) FROM employees WHERE outletid = p_outletid;
-- now do deletes
DELETE FROM employees WHERE outletid = p_outletid;

DELETE FROM outletinterests WHERE outletid = p_outletid;
DELETE FROM outletcoverage WHERE outletid = p_outletid;
DELETE FROM internal.research_control_record WHERE objectid = p_outletid AND objecttypeid=1;

DELETE FROM outlets WHERE outletid = p_outletid;

END;

$$ LANGUAGE plpgsql SECURITY DEFINER;
