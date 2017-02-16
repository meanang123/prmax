select o.outletid,o.outletname,g.geographicalname from 
outletcoverage as oc join outlets as o on o.outletid = oc.outletid
join internal.geographical as g on g.geographicalid = oc.geographicalid
where 
o.prmax_outlettypeid in ( select prmax_outlettypeid from internal.prmax_outlettypes where prmax_outlettypename in ( 'Magazines - Business orientated', 'Magazines - Supplements - Business orientated','Newsletters - Business orientated','Directories - Business orientated'))
ORDER BY o.outletname;

select o.outletid,o.outletname,g.geographicalname from 
outletcoverage as oc join outlets as o on o.outletid = oc.outletid
join internal.geographical as g on g.geographicalid = oc.geographicalid
where 
o.prmax_outlettypeid in ( select prmax_outlettypeid from internal.prmax_outlettypes where prmax_outlettypename ilike( '%radio%')) ORDER BY o.outletname


select o.outletid,o.outletname,g.geographicalname from 
outletcoverage as oc join outlets as o on o.outletid = oc.outletid
join internal.geographical as g on g.geographicalid = oc.geographicalid
where 
o.prmax_outlettypeid in ( select prmax_outlettypeid from internal.prmax_outlettypes where prmax_outlettypename ilike( '%television%')) ORDER BY o.outletname



