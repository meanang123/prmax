
CREATE OR REPLACE FUNCTION fix_distribution_list(p_emailtemplateid integer)
  RETURNS VOID
  AS $$
DECLARE
p_emailtemplate RECORD;
p_list RECORD;
BEGIN
	-- get the emailtemplate record
	SELECT * INTO p_emailtemplate FROM userdata.emailtemplates WHERE emailtemplateid = p_emailtemplateid;
	SELECT * INTO p_list FROM userdata.list WHERE listid = p_emailtemplate.listid;

	IF p_list.fixed = false THEN
		-- convert distribution list too a text list
		INSERT INTO userdata.listmemberdistribution(job_title,familyname,firstname,prefix,suffix,outletname,listid,listmemberid,emailaddress)
		SELECT e.job_title,c.familyname,c.firstname,c.prefix,c.suffix,o.outletname,lm.listid,lm.listmemberid,
			get_override(occ_c.email, e_c.email,oc_c.email, o_c.email)
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
			WHERE lm.listid = p_emailtemplate.listid;
	END IF;
	-- mark blank emailaddress as ignore
		UPDATE userdata.listmemberdistribution AS lmd
			SET emailstatusid = 4
			FROM userdata.listmembers AS LM
		WHERE lm.listmemberid = lmd.listmemberid AND lm.listid = p_emailtemplate.listid AND ( emailaddress IS NULL OR LENGTH(emailaddress) = 0 );

	-- Deduplicate the email address as mark entries as such
	EXECUTE deduplicateemailaddress ( p_emailtemplate.listid );

	-- fix contact
	UPDATE userdata.listmembers AS lm
		SET employeeid = o.primaryemployeeid
		FROM outlets AS o
		WHERE lm.listid = p_emailtemplate.listid AND
			lm.outletid = o.outletid AND
			lm.employeeid IS NULL AND
			NOT EXISTS ( SELECT employeeid FROM userdata.listmembers AS lm2 WHERE lm2.listid = lm.listid AND lm2.employeeid = o.primaryemployeeid);

	-- at this point we need to remove user unsubcribe for this customers
	-- it can onlybe done at this point not earliers as we dont' knwo the email address at that point

	-- UPDATE userdata.listmemberdistribution
	--	SET emailstatusid = 8
	--	FROM userdata.listmemberdistribution AS lmd
	--	JOIN userdata.list AS l ON lmd.listid = l.listid
	--	JOIN userdata.unsubscribe AS un ON un.emailaddress ilike lmd.emailaddress AND un.customerid = l.customerid
	--	WHERE
	--		lmd.listid = p_emailtemplate.listid AND lmd.emailstatusid = 2 AND
	--		userdata.listmemberdistribution.listid = p_emailtemplate.listid AND
	--		userdata.listmemberdistribution.emailstatusid = 2 AND
	--		un.emailaddress = userdata.listmemberdistribution.emailaddress AND
	--		un.customerid = l.customerid;

	-- fix up records
	UPDATE userdata.list SET fixed = true WHERE listid = p_emailtemplate.listid;
	UPDATE userdata.emailtemplates SET pressreleasestatusid = 2 WHERE emailtemplateid = p_emailtemplateid;
END;
$$ LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION deduplicateemailaddress( listid integer ) returns void AS $$

  if SD.has_key("prmax_list_dist_emails"):
    plan_list = SD["prmax_list_dist_emails"]
    plan_update = SD["prmax_update_dist_email"]
  else:
    plan_list = plpy.prepare("SELECT emailaddress,listmemberdistributionid FROM userdata.listmemberdistribution WHERE listid = $1 AND emailaddress IS NOT NULL AND LENGTH(emailaddress) > 0 ", [ "int",])
    SD["prmax_list_dist_emails"] = plan_list
    plan_update = plpy.prepare("UPDATE userdata.listmemberdistribution SET emailstatusid = 5 WHERE listmemberdistributionid = $1 ", [ "int",])
    SD["prmax_update_dist_email"] = plan_update

  emails = {}
  results = plpy.execute(plan_list,[listid,])
  for row in results:
    if emails.has_key( row["emailaddress"].lower()):
      plpy.execute(plan_update,[row["listmemberdistributionid"],])
    else:
      emails[row["emailaddress"].lower()] = True

$$ LANGUAGE plpythonu;
