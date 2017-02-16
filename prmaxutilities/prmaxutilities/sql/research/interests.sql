\c prmax
\a
\t
\o /tmp/outletinterests.txt

select oi.outletid,o.outletname,o.www,ot.prmax_outlettypename,i.interestname from outletinterests as oi
join interests as i on i.interestid = oi.interestid
join outlets as o on o.outletid = oi.outletid
left outer join internal.prmax_outlettypes as ot ON ot.prmax_outlettypeid = o.prmax_outlettypeid
left outer join internal.research_control_record AS rc ON rc.objectid  = o.outletid and rc.objecttypeid = 1
-- WHERE rc.interests_by_prmax = false and o.customerid = -1 and sourcetypeid = 1
WHERE rc.interests_by_prmax = false and o.customerid = -1
order by o.outletname,i.interestname;
\o
\a
\t
\o /tmp/interests.txt
select * from interests where isroot = 1;
\o
\a
\t
\o /tmp/interests_done.txt
select o.outletid,o.outletname from outlets as o
where o.outletid not in ( select objectid from internal.research_control_record where objecttypeid = 1 AND interests_by_prmax = true )
order by o.outletname;
\o
\q