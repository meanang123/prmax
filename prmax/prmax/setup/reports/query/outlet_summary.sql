<queries>
	<query	type="SQL"
				format="single"
				dictname="outlet"
				defaultsortorder="">
		SELECT
			o.outletname,op.outletname as poutletname,op.outletid as poutletid,
			get_override(oc_c.tel,c.tel) as tel,
			get_overrideflag(oc_c.tel,c.tel) as telflag,
			get_override(oc_c.email,c.email) as email,
			get_overrideflag(oc_c.email,c.email) as emailflag,
			get_override(oc_c.fax,c.fax) as fax,
			get_overrideflag(oc_c.fax,c.fax) as faxflag,
			get_override(oc_c.mobile,c.mobile) as mobile,
			get_overrideflag(oc_c.mobile,c.mobile) as mobileflag,
			o.outlettypeid,
			CASE WHEN a_oc.address1 IS NULL THEN
			AddressFull(a_o.address1,a_o.address2,a_o.county,a_o.postcode,town.geographicalname,a_o.townname)
			ELSE
			AddressFull(a_oc.address1,a_oc.address2,a_oc.county,a_oc.postcode,a_octown.geographicalname,a_oc.townname)
			END as address,
			CASE WHEN a_oc.address1 IS NULL THEN  false ELSE true END as addressflag,
			ot.outlettypename,pt.producttypename,ii.industryname,f.frequencyname,rf.regionalfocusname,o.circulation,
			o.profile,o.established,o.price,o.subprice,o.www,dp.deliverypreferencename,
			ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) as contactname,
			CASE WHEN o.customerid=-1 AND NOT e.customerid=-1 THEN true ELSE false END as employeeflag,
			e.job_title,
			o.customerid,
			o.outletid,
			o.outlettypeid,
			get_overrideflag(oc.primaryemployeeid,o.primaryemployeeid) as primaryflag,
			o.profile,
			oc.profile as localprofile

			FROM outlets as o
			LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = o.outletid AND oc.customerid = %(customerid)s
			LEFT OUTER JOIN outlets as op ON o.parentoutletid = op.outletid
			JOIN communications as c ON c.communicationid = o.communicationid
			LEFT OUTER JOIN communications as oc_c ON oc_c.communicationid = oc.communicationid
			LEFT OUTER JOIN addresses as a_o on a_o.addressid = c.addressid
			LEFT OUTER JOIN addresses as a_oc on a_oc.addressid = oc_c.addressid
			JOIN internal.outlettypes as ot on ot.outlettypeid = o.outlettypeid
			LEFT OUTER JOIN internal.industries as ii on ii.industryid = o.industryid
			LEFT OUTER JOIN internal.producttypes as pt on pt.producttypeid = o.producttypeid
			LEFT OUTER JOIN internal.frequencies as f on f.frequencyid = o.frequencyid
			LEFT OUTER JOIN internal.regionalfocus as rf on rf.regionalfocusid = o.regionalfocusid
			LEFT OUTER JOIN internal.deliverypreferences as dp ON dp.deliverypreferenceid = o.deliverypreferenceid
			LEFT OUTER JOIN internal.geographical AS town ON a_o.townid=town.geographicalid
			LEFT OUTER JOIN  internal.geographical AS a_octown ON a_oc.townid=a_octown.geographicalid
			LEFT OUTER JOIN employees as e ON CASE WHEN  oc.primaryemployeeid IS NULL THEN o.primaryemployeeid ELSE oc.primaryemployeeid END = e.employeeid
			LEFT OUTER JOIN contacts as con ON con.contactid = e.contactid
			WHERE
			o.outletid = %(outletid)s
	</query>
	<query	type="SQL"
				format="multiple"
				dictname="interests"
				defaultsortorder="">
	SELECT interestname  FROM outletinterest_view WHERE ( customerid=-1 OR customerid=%(customerid)s ) AND outletid = %(outletid)s AND interesttypeid = 1
	</query>
	<query	type="SQL"
				format="multiple"
				dictname="tags"
				defaultsortorder="">
		SELECT interestname  FROM outletinterest_view
	WHERE ( customerid=-1 OR customerid = %(customerid)s ) AND outletid =  %(outletid)s AND interesttypeid = 2
	</query>
	<query	type="SQL"
				format="multiple"
				dictname="coverage"
				defaultsortorder="">
		select oc.geographicalname from outletcoverage_view as oc
	WHERE ( oc.customerid=-1 OR oc.customerid=%(customerid)s  ) AND oc.outletid = %(outletid)s
	</query>
</queries>
