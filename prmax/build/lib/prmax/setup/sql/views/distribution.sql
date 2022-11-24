DROP VIEW distributed_view;
CREATE OR REPLACE VIEW distributed_view AS SELECT
	lmd.listid,
	lmd.outletname,
	ContactName(prefix, firstname, '', familyname, suffix) as contactname,
	get_override(ec_c.tel,e_c.tel,oc_c.tel,o_c.tel) as tel,
	emailaddress,
	ds.distributionstatusdescription,
	UPPER(lmd.outletname) AS sortname
	FROM userdata.listmemberdistribution AS lmd
	JOIN userdata.listmembers AS lm ON lm.listmemberid = lmd.listmemberid
	JOIN userdata.list AS l on lm.listid = l.listid
	LEFT OUTER JOIN outlets AS o ON o.outletid = lm.outletid	
	LEFT OUTER JOIN employees AS e ON e.employeeid = lm.employeeid
	LEFT OUTER JOIN communications as o_c ON o.communicationid = o_c.communicationid 
	LEFT OUTER JOIN communications as e_c ON e.communicationid = e_c.communicationid 
	LEFT OUTER JOIN employeecustomers as ec ON ec.employeeid = lm.employeeid AND ec.customerid = l.customerid 
LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = o.outletid AND oc.customerid = l.customerid 
LEFT OUTER JOIN communications as ec_c ON ec.communicationid = ec_c.communicationid 
LEFT OUTER JOIN communications as oc_c ON oc_c.communicationid = oc.communicationid 
LEFT OUTER JOIN internal.distributionstatus AS ds ON lmd.emailstatusid = ds.distributionstatusid;

GRANT SELECT ON distributed_view TO prmax;