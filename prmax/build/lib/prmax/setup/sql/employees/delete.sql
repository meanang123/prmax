--
-- Delete an employee record, if it's used to alter the roles
--
--

CREATE OR REPLACE FUNCTION employee_empty( p_employeeid integer )
RETURNS void AS $$
DECLARE
BEGIN
	-- make sure all sub-info has been deleted
	DELETE FROM employeeinterests where employeeid = p_employeeid;
	DELETE FROM employeeprmaxroles where employeeid = p_employeeid;
	-- didn't get name
	--
	UPDATE employees SET prmaxstatusid = 2, contactid = NULL WHERE employeeid = p_employeeid;
	UPDATE communications SET email = '', tel = '' WHERE communicationid = (SELECT communicationid FROM employees WHERE employeeid = p_employeeid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION employee_type_delete( p_employeeid integer )
RETURNS void AS $$
DECLARE
p_outletid INTEGER;
BEGIN
	SELECT outletid INTO p_outletid FROM outlets WHERE primaryemployeeid = p_employeeid;
	IF p_outletid IS NULL  THEN
		-- make sure all sub-info has been deleted
		DELETE FROM employeeinterests where employeeid = p_employeeid;
		DELETE FROM employeeprmaxroles where employeeid = p_employeeid;

		DELETE FROM employees WHERE employeeid = p_employeeid;
	ELSE
		EXECUTE employee_empty ( p_employeeid );
	END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION employee_delete ( p_employeeid integer)
RETURNS void AS $$
DECLARE
	used_count integer;
	p_prmaxroleid integer;
	employeeid_roleid integer;
	employeerow employees%ROWTYPE;
	p_listid RECORD;
BEGIN
 used_count := 0;
 employeeid_roleid := NULL;
 p_prmaxroleid := NULL;

-- remove employee links from fixed distribution list
UPDATE userdata.listmembers SET employeeid = NULL
	FROM userdata.list AS l WHERE l.listid = userdata.listmembers.listid AND listtypeid = 2 AND userdata.listmembers.employeeid = p_employeeid AND l.fixed = true ;
-- remove references
UPDATE outletcustomers SET primaryemployeeid = NULL WHERE primaryemployeeid = p_employeeid;

-- get basic information
SELECT COUNT(*) INTO used_count FROM userdata.listmembers AS lm JOIN userdata.list AS l ON l.listid = lm.listid WHERE lm.employeeid = p_employeeid;
SELECT * INTO employeerow FROM employees WHERE employeeid = p_employeeid;
-- basic clear down
-- make sure no interests;
DELETE FROM employeeinterests where employeeid = p_employeeid;

IF used_count = 0  THEN
	-- not used in a list then delete
	EXECUTE employee_type_delete( p_employeeid ) ;
ELSE
	-- get role if possible
	SELECT prmaxroleid INTO p_prmaxroleid FROM employeeprmaxroles WHERE employeeid = p_employeeid LIMIT 1;
	-- check roles
	IF p_prmaxroleid IS NOT NULL THEN
		employeeid_roleid := NULL;
		SELECT employeeid INTO employeeid_roleid FROM employeeprmaxroles WHERE outletid = employeerow.outletid AND employeeid != p_employeeid AND prmaxroleid = p_prmaxroleid LIMIT 1;
		if employeeid_roleid IS NOT NULL THEN
			-- roles exist
			-- remove this employee from all the lists and replace it withh the new role unless already in list in which case delete will cope with it
			FOR p_listid IN SELECT listid FROM userdata.listmembers WHERE employeeid = p_employeeid GROUP BY listid LOOP
				-- check too see new cound if not in list ehn update
				used_count := 0;
				-- has new employee in list of employee is reference because it is primary
				SELECT COUNT(*) INTO used_count FROM userdata.listmembers AS lm JOIN outlets AS o ON o.outletid = lm.outletid
					WHERE ( employeeid = employeeid_roleid OR
									lm.employeeid is NULL AND o.primaryemployeeid = employeeid_roleid) AND listid = p_listid.listid;
				IF used_count IS NULL OR used_count = 0 THEN
					UPDATE  userdata.listmembers SET employeeid = employeeid_roleid WHERE employeeid = p_employeeid and listid = p_listid.listid;
				END IF;
			END LOOP;
			-- make sure no job roles
			DELETE FROM employeeprmaxroles where employeeid = p_employeeid;
			-- delete the old employee
			EXECUTE employee_type_delete( p_employeeid ) ;
		ELSE
			EXECUTE employee_empty ( p_employeeid );
		END IF;
	ELSE
		EXECUTE employee_empty ( p_employeeid );
	END IF;
END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- removed all delete and unused employees
CREATE OR REPLACE FUNCTION employee_cleardown()
RETURNS void AS $$
DECLARE
	used_count integer;
	delete_employees RECORD;
	employeeid_roleid integer;
	p_outletid INTEGER;
	p_listid RECORD;
BEGIN
 used_count := 0;

 FOR delete_employees IN SELECT * FROM employees WHERE prmaxstatusid = 2 LOOP
	SELECT COUNT(*) INTO used_count FROM userdata.listmembers AS lm WHERE lm.employeeid = delete_employees.employeeid;
	IF used_count = 0  THEN
		SELECT outletid INTO p_outletid FROM outlets WHERE primaryemployeeid = p_employeeid;
		if p_outletid IS NULL THEN
			DELETE FROM employees WHERE delete_employees.employeeid;
		END IF;
	ELSE
		SELECT employeeid INTO employeeid_roleid FROM employeeprmaxroles WHERE outletid = employeerow.outletid AND employeeid != p_employeeid LIMIT 1;
		IF employeeid_roleid IS NOT NULL THEN
			FOR p_listid IN SELECT listid FROM userdata.listmembers WHERE employeeid = p_employeeid GROUP BY listid LOOP
				-- check too see new cound if not in list ehn update
				used_count := 0;
				SELECT COUNT(*) INTO used_count FROM userdata.listmembers WHERE employeeid = employeeid_roleid AND listid = p_listid.listid;
				IF used_count IS NULL OR used_count = 0 THEN
					UPDATE  userdata.listmembers SET employeeid = employeeid_roleid WHERE employeeid = p_employeeid and listid = p_listid.listid;
				END IF;
			END LOOP;
			DELETE FROM employees WHERE employeeid = p_employeeid;
		END IF;
	END IF;
 END LOOP;

	EXECUTE removed_duplicates_priamry_outlets_in_list();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove Duplicate primary contacts from list
-- this is those that are blank
CREATE OR REPLACE FUNCTION removed_duplicates_priamry_outlets_in_list()
RETURNS void AS $$
DECLARE
	p_listmemberid integer;
	delete_employees RECORD;
BEGIN
 FOR delete_employees IN SELECT l.listid,outletid,COUNT(*) from userdata.listmembers as lm
			JOIN userdata.list as l ON l.listid = lm.listid
			WHERE employeeid is null AND l.listtypeid = 1
			GROUP BY l.listid,outletid HAVING COUNT(*) >1 LOOP
	SELECT listmemberid INTO p_listmemberid FROM userdata.listmembers WHERE listid = delete_employees.listid AND outletid = delete_employees.outletid AND employeeid is NULL LIMIT 1;
	DELETE FROM userdata.listmembers WHERE listmemberid = p_listmemberid;
 END LOOP;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
