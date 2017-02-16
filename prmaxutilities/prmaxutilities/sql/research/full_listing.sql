select o.outletid, o.outletname,ot.prmax_outlettypename,f.frequencyname
from outlets AS o
LEFT OUTER JOIN internal.prmax_outlettypes as ot ON ot.prmax_outlettypeid = o.prmax_outlettypeid
LEFT OUTER JOIN internal.frequencies AS f ON f.frequencyid = o.frequencyid
where o.customerid = -1 AND o.prmax_outlettypeid != 42
order by outletid;