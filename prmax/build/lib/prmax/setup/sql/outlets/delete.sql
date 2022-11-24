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

CREATE OR REPLACE FUNCTION outlet_delete_pre_clean( p_outletid integer)
RETURNS void AS $$

BEGIN
-- remove from all lists
DELETE FROM searchsession WHERE outletid = p_outletid;

-- Remove links from distributions
UPDATE userdata.listmembers SET outletid = NULL,employeeid = NULL
	FROM userdata.list AS l WHERE l.listid = userdata.listmembers.listid AND listtypeid = 2 AND userdata.listmembers.outletid = p_outletid AND l.fixed = true ;

-- Remove record from standard lists
DELETE userdata.listmembers
	FROM userdata.list AS l WHERE l.listid = userdata.listmembers.listid AND listtypeid = 1 AND userdata.listmembers.outletid = p_outletid;

-- cleanup clippings
UPDATE userdata.clippings SET  outletid = NULL, listmemberid = NULL WHERE outletid = p_outletid;
UPDATE clippingstore SET outletid = NULL, employeeid = NULL WHERE outletid = p_outletid;

DELETE research.bounceddistribution WHERE outletid = p_outletid;
DELETE research.researchprojectitem WHERE outletid = p_outletid;

END;

$$ LANGUAGE plpgsql SECURITY DEFINER;
