CREATE OR REPLACE FUNCTION unsubscribe_count_for_list(p_listid integer)
  RETURNS integer
  AS $$
DECLARE
p_nbr integer;
listrow userdata.list%ROWTYPE;
BEGIN
	SELECT INTO listrow * FROM userdata.list WHERE listid = p_listid;

  SELECT COALESCE(COUNT(*),0) INTO  p_nbr
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
    WHERE lm.listid = p_listid AND lower(get_override(occ_c.email, e_c.email,oc_c.email, o_c.email))
			IN ( SELECT emailaddress FROM userdata.unsubscribe WHERE customerid = listrow.customerid);

	RETURN p_nbr;
END;

$$ LANGUAGE plpgsql;
