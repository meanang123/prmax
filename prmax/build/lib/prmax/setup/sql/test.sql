-- Demo's 
SELECT isdemo,COUNT(*) FROM internal.customers WHERE date_trunc('month',created::date) = date_trunc('month',now()) AND date_trunc('year',created::date) = date_trunc('year',now()) AND customertypeid = 1 GROUP BY isdemo;
-- Finacial 
SELECT c.customerid,c.customername,fs.financialstatusdescription,cs.customerstatusname,
ROUND(SUM(ci.invoiceamount)/100.00,2) 
FROM internal.customers as c 
LEFT OUTER JOIN accounts.customerinvoices AS ci ON ci.customerid = c.customerid 
LEFT OUTER JOIN internal.customerstatus AS cs ON cs.customerstatusid = c.customerstatusid
JOIN internal.financialstatus AS fs ON fs.financialstatusid = c.financialstatusid

WHERE date_trunc('month',created::date) = date_trunc('month',now()) AND date_trunc('year',created::date) = date_trunc('year',now()) AND isdemo = false AND customertypeid = 1
GROUP BY c.customerid,c.customername,fs.financialstatusdescription,cs.customerstatusname;

-- Others types
SELECT ct.customertypename,COUNT(*) FROM internal.customers AS c JOIN internal.customertypes AS ct ON ct.customertypeid = c.customertypeid WHERE date_trunc('month',created::date) = date_trunc('month',now()) AND date_trunc('year',created::date) = date_trunc('year',now()) GROUP BY ct.customertypename;
