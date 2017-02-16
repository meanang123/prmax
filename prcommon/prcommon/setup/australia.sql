INSERT INTO research.researchdetails(outletid,surname,firstname,prefix,email,job_title)
select o.outletid,c.familyname,c.firstname,c.prefix,outc.email,e.job_title
from outlets as o
join communications as outc ON outc.communicationid = o.communicationid
join employees as e ON e.employeeid = o.primaryemployeeid
join communications as com ON com.communicationid = e.communicationid
left outer join contacts as c on c.contactid = e.contactid
left outer join research.researchdetails as rd on o.outletid = rd.outletid
WHERE o.countryid = 119 and o.customerid = -1 and rd.outletid is null;

UPDATE contacts set sourcetypeid = 2 where sourcetypeid =4 and contactid in ( select contactid from employees where outletid in ( select outletid from outlets where countryid = 119 and sourcetypeid = 4 ) ) ;
UPDATE outlets set sourcetypeid = 2 where countryid = 119 and sourcetypeid = 4;

update addresses as a
SET postcode = REPLACE(a.postcode,'.0','' )
from outlets as o
join communications as com ON com.communicationid = o.communicationid
WHERE a.addressid = com.addressid AND o.customerid = -1 AND o.sourcetypeid = 2 AND o.countryid = 119 AND a.postcode ilike '%.0%';
