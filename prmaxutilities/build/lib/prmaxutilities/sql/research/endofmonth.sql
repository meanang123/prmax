\c prmax
\a
\t
\o /tmp/customer_month.txt
SELECT customerid, customername, licence_expire 
FROM internal.customers 
WHERE 
licence_expire > '2009-12-01' AND isinternal = false AND isdemo = false;
\o /tmp/customer_payments.txt
select 
c.customerid,c.customername, ROUND(cp.payment/100.00,2),cpt.customerpaymenttypename
FROM internal.customerpayments AS cp
JOIN internal.customers AS c ON c.customerid = cp.customerid
JOIN internal.customerpaymenttypes AS cpt ON cpt.customerpaymenttypeid = cp.paymenttypeid
WHERE
CAST(cp.actualdate AS DATE) >= '2009-11-01' AND CAST(cp.actualdate AS DATE) <='2009-11-30';
