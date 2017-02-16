SELECT 
c.customerid, c.customername,
to_char(au.auditdate,'DD-MM-YY') AS invoicedate,
round(cp.payment/100.0,2) AS gross,
round(cp.vat/100.0,2) AS vat,
round((cp.payment - cp.vat)/100.0,2) AS net,
cpt.customerpaymenttypename,
au.invoicenbr,
au.emailedtoaddress

FROM internal.audittrail AS au
JOIN internal.customers AS c ON c.customerid = au.customerid 
LEFT OUTER JOIN internal.customerpayments AS cp ON cp.customerid = c.customerid
LEFT OUTER JOIN internal.customerpaymenttypes AS cpt ON cp.paymenttypeid = cpt.customerpaymenttypeid
WHERE CAST(au.auditdate AS DATE) BETWEEN '2010-09-27' AND '2010-09-27'
AND au.audittypeid = 4 and au.invoicenbr IS NOT NULL