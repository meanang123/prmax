<queries>	<query type="SQL" format="multiple" dictname="results" defaultsortorder="outletname"> SELECT JSON(CASE WHEN o.outlettypeid=19 THEN '' WHEN o.prmax_outlettypeid in (50,51,52,53,54,55,56,57,58,59,60,61,62) THEN '' ELSE o.outletname END)as outletname, JSON(ContactName(c.prefix,c.firstname,c.middlename,c.familyname,c.suffix)) as contactname, get_override(ec_c.tel,e_c.tel,oc_c.tel,o_c.tel) as tel, get_override(ec_c.email,e_c.email,oc_c.email,o_c.email) as email, CASE WHEN s.employeeid IS NULL THEN o.primaryemployeeid ELSE s.employeeid END as employeeid FROM userdata.searchsession as s JOIN outlets as o on o.outletid = s.outletid JOIN employees as e on CASE WHEN s.employeeid IS NULL THEN o.primaryemployeeid ELSE s.employeeid  END = e.employeeid JOIN tg_user as u on s.userid = u.user_id JOIN communications as o_c ON o.communicationid = o_c.communicationid LEFT OUTER JOIN communications as e_c ON e.communicationid = e_c.communicationid LEFT OUTER JOIN employeecustomers as ec ON ec.employeeid = s.employeeid AND ec.customerid = s.customerid LEFT OUTER JOIN outletcustomers as oc ON oc.outletid = o.outletid AND oc.customerid = s.customerid LEFT OUTER JOIN communications as ec_c ON ec.communicationid = ec_c.communicationid LEFT OUTER JOIN communications as oc_c ON oc_c.communicationid = oc.communicationid JOIN contacts as c on e.contactid = c.contactid LEFT OUTER JOIN internal.prmax_outlettypes AS pr ON pr.prmax_outlettypeid = o.prmax_outlettypeid WHERE s.userid = %(userid)s and s.searchtypeid= %(searchtypeid)s AND SELECTION(s.selected, %(selector)s)=true ORDER BY outletname</query></queries>

