select sourcename,COUNT(*)  from outlets AS o join internal.sourcetypes as st on st.sourcetypeid = o.sourcetypeid  where customerid = -1 group by sourcename;



--
select COUNT(*) from employees where outletid in ( SELECT outletid from outlets AS o where o.customerid = -1 and prmax_outlettypeid != 42);
select COUNT(*) from outlets AS o where o.customerid = -1 and prmax_outlettypeid != 42;