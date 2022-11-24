DROP FUNCTION IF EXISTS list_exclusion(p_listid integer, p_customerid integer);

CREATE OR REPLACE FUNCTION list_exclusion(p_listid integer, p_customerid integer )
  RETURNS integer
  AS $$
DECLARE
p_nbr integer;
p_nbr_tmp integer;

BEGIN
	-- delete a specifically referenced employee
	p_nbr := 0;
	SELECT COALESCE(COUNT(*),0) INTO  p_nbr_tmp FROM userdata.listmembers AS lm JOIN userdata.exclusionlist el ON el.customerid = p_customerid AND el.employeeid = lm.employeeid
		WHERE el.customerid = p_customerid and lm.listid = p_listid;
	p_nbr := p_nbr + p_nbr_tmp;

	-- remove
	DELETE FROM userdata.listmembers AS lm USING userdata.exclusionlist AS el, internal.customers AS c
		WHERE el.customerid = p_customerid AND lm.employeeid = el.employeeid AND lm.listid = p_listid;

	-- remove employees referenced by their primary employeeid

	SELECT COALESCE(COUNT(*),0) INTO p_nbr_tmp FROM userdata.listmembers AS lm JOIN outlets AS o ON o.outletid = lm.outletid JOIN userdata.exclusionlist el ON el.customerid = p_customerid AND el.employeeid = o.primaryemployeeid
		WHERE el.customerid = p_customerid AND lm.listid = p_listid AND lm.employeeid IS NULL;
	p_nbr := p_nbr + p_nbr_tmp;
	DELETE FROM userdata.listmembers AS lm USING userdata.exclusionlist AS el, outlets AS o
		WHERE el.customerid = p_customerid AND el.employeeid = o.primaryemployeeid AND lm.listid = p_listid AND o.outletid = lm.outletid AND lm.employeeid IS NULL;

	-- remove outlets
	SELECT COALESCE(COUNT(*),0) INTO  p_nbr_tmp FROM userdata.listmembers AS lm JOIN userdata.exclusionlist el ON el.customerid = p_customerid AND el.outletid = lm.outletid WHERE lm.listid = p_listid AND el.customerid = p_customerid;
	p_nbr := p_nbr + p_nbr_tmp;

	-- Delete outlets
	DELETE FROM userdata.listmembers AS lm USING userdata.exclusionlist AS el
		WHERE el.customerid = p_customerid and lm.listid = p_listid AND el.outletid = lm.outletid;

	-- Now we need to delete with the user unsubscribes
	SELECT unsubscribe_count_for_list( p_listid ) INTO p_nbr_tmp;
	p_nbr := p_nbr + p_nbr_tmp;

	DELETE FROM userdata.listmembers
		WHERE listmemberid IN
			(SELECT lm.listmemberid
			FROM userdata.listmembers AS lm
			JOIN userdata.list AS l ON l.listid = lm.listid
			JOIN outlets AS o ON lm.outletid = o.outletid
			JOIN communications as o_c ON o.communicationid = o_c.communicationid
			LEFT OUTER JOIN outletcustomers as oc ON lm.outletid = oc.outletid AND l.customerid = oc.customerid
			LEFT OUTER JOIN communications as oc_c ON oc.communicationid = oc_c.communicationid
			LEFT OUTER JOIN employees AS e ON e.employeeid = COALESCE(lm.employeeid, o.primaryemployeeid)
			LEFT OUTER JOIN contacts AS c ON c.contactid = e.contactid
			LEFT OUTER JOIN communications as e_c ON e.communicationid = e_c.communicationid
			LEFT OUTER JOIN employeecustomers as occ ON e.employeeid = occ.employeeid AND l.customerid = occ.customerid
			LEFT OUTER JOIN communications as occ_c ON occ_c.communicationid = occ.communicationid
			WHERE
				lm.listid = p_listid AND
				lower(get_override(occ_c.email, e_c.email,oc_c.email, o_c.email)) IN
					( SELECT emailaddress FROM userdata.unsubscribe WHERE customerid =
					( SELECT customerid from userdata.list WHERE listid = p_listid)));



	RETURN p_nbr;
END;
$$ LANGUAGE plpgsql VOLATILE;
