DROP VIEW advancefeaturesinterest_view;
-- Create a view of the advance features interest
CREATE OR REPLACE VIEW advancefeaturesinterest_view AS
 SELECT afi.advancefeatureinterestid, afi.advancefeatureid, af.customerid, af.outletid, afi.interestid, i.interestname
   FROM advancefeaturesinterests AS afi
   JOIN advancefeatures AS af ON afi.advancefeatureid = af.advancefeatureid
   JOIN interests i ON i.interestid = afi.interestid
  ORDER BY i.interestname;

GRANT SELECT ON advancefeaturesinterest_view TO prmax;

DROP VIEW advancefeatureslistresultview;
CREATE VIEW advancefeatureslistresultview AS
SELECT advancefeatureslistid,advancefeatureslistmemberid,o.outletname,af.feature,publicationdate_date,editorial_date,
e.job_title,
ContactName(con.prefix,con.firstname,con.middlename,con.familyname,con.suffix) as contactname,
UPPER(o.outletname) AS sortname,
UPPER(con.familyname) AS sortfamily,
af.outletid,
ToPartialDate(af.publicationdate_description,af.publicationdate_date,af.publicationdate_partial) as pub_date_display,
ToPartialDate(a.editorial_description,a.editorial_date,a.editorial_partial) as editorial_date_display,
afl.selected,
af.advancefeatureid,
pr.prmax_outletgroupid,
pr.sortorder

FROM userdata.advancefeatureslistmembers AS afl
JOIN advancefeatures AS af ON af.advancefeatureid = afl.advancefeatureid
JOIN outlets AS o ON af.outletid = o.outletid
LEFT OUTER JOIN employees AS e ON e.employeeid = af.employeeid
LEFT OUTER JOIN contacts AS con ON e.contactid = con.contactid
LEFT OUTER JOIN internal.prmax_outlettypes AS pr ON pr.prmax_outlettypeid = o.prmax_outlettypeid
ORDER BY af.publicationdate_date;

GRANT SELECT ON advancefeatureslistresultview TO prmax;

CREATE OR REPLACE VIEW advancelist_view_extended AS
 SELECT afl.advancefeatureslistid, afl.advancefeatureslistmemberid, o.outletname, af.feature, af.publicationdate_date, af.editorial_date, e.job_title, contactname(con.prefix::text, con.firstname::text, con.middlename::text, con.familyname::text, con.suffix::text) AS contactname, upper(o.outletname::text) AS sortname, upper(con.familyname::text) AS sortfamily, af.outletid, topartialdate(af.publicationdate_description::text, af.publicationdate_date, af.publicationdate_partial) AS pub_date_display, topartialdate(af.editorial_description::text, af.editorial_date, af.editorial_partial) AS editorial_date_display, afl.selected, af.advancefeatureid, pr.prmax_outletgroupid, pr.sortorder,
  get_override(ec_c.email,e_c.email,oc_oc.email,o_c.email) as email,
  get_override(ec_c.tel,e_c.tel,oc_oc.tel,o_c.tel) as tel

   FROM userdata.advancefeatureslistmembers afl
   JOIN userdata.advancefeatureslist AS afll ON afll.advancefeatureslistid = afl.advancefeatureslistid
   JOIN advancefeatures af ON af.advancefeatureid = afl.advancefeatureid
   JOIN outlets o ON af.outletid = o.outletid
   LEFT JOIN employees e ON e.employeeid = COALESCE(af.employeeid,o.primaryemployeeid)
   LEFT JOIN contacts con ON e.contactid = con.contactid
   LEFT JOIN internal.prmax_outlettypes pr ON pr.prmax_outlettypeid = o.prmax_outlettypeid
   LEFT OUTER JOIN employeecustomers as ec ON ec.employeeid = e.employeeid AND ec.customerid = afll.customerid
   LEFT OUTER JOIN outletcustomers as oc ON af.outletid = oc.outletid AND afll.customerid = oc.customerid
   LEFT OUTER JOIN communications as o_c ON o_c.communicationid = o.communicationid
   LEFT OUTER JOIN communications as oc_oc ON oc_oc.communicationid = oc.communicationid
   LEFT OUTER JOIN communications as e_c ON e_c.communicationid = e.communicationid
   LEFT OUTER JOIN communications as ec_c ON ec_c.communicationid = ec.communicationid;
 GRANT SELECT ON advancelist_view_extended TO prmax;