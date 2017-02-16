select outletid,outletname, ot.outlettypename
from outlets as o 
join internal.outlettypes as ot on o.outlettypeid = ot.outlettypeid
where prmax_outlettypeid is null and o.prn_key > 0 