DROP VIEW accounts_active_customer_report;
CREATE VIEW accounts_active_customer_report AS SELECT
c.customerid,
c.customername,
TO_CHAR(c.licence_expire,'DD-MM-YYYY') AS licence_expire,
TO_CHAR(c.licence_start_date,'DD-MM-YYYY') AS licence_start_date,
c.renewal_date,
c.logins,
c.isdemo,
c.isinternal,
cs.customerstatusname,
pt.paymentmethodname,
ROUND(c.pay_monthly_value/100.00 - (c.pay_monthly_value/100.00 - (c.pay_monthly_value/100.00)/1.2),2) AS net_std_monthly,
c.advancefeatures,
c.updatum AS Monitoring,
c.maxmonitoringusers AS MonitoringUsers,
c.seo,
c.crm,
to_char((SELECT MAX(last_logged_in) FROM tg_user AS u WHERE u.customerid = c.customerid AND u.usertypeid = 1), 'DD-MM-YY') AS last_login_display,
-- last invoiceis fixed term - vat
(SELECT ROUND((invoiceamount-vat)/100.00,2) FROM accounts.customerinvoices AS ci WHERE ci.customerid = c.customerid ORDER BY ci.customerinvoiceid DESC LIMIT 1) AS net_last_invoice,
array_to_string(array(SELECT ds.prmaxdatasetdescription FROM internal.customerprmaxdatasets AS cpd JOIN internal.prmaxdatasets AS ds ON ds.prmaxdatasetid=cpd.prmaxdatasetid WHERE  cpd.customerid = c.customerid),', ') AS prmaxdatasets,
c.customerstatusid
FROM internal.customers AS c
JOIN internal.customerstatus AS cs ON cs.customerstatusid = c.customerstatusid
LEFT OUTER JOIN internal.paymentmethods AS pt ON pt.paymentmethodid = c.paymentmethodid;
