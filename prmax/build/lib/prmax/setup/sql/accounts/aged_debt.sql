DROP TYPE aged_debt CASCADE ;
CREATE TYPE aged_debt AS (
	customerid integer,
	customername varchar,
	total numeric,
	days030 numeric,
	days3060 numeric,
	days6090 numeric,
	days90120 numeric,
	days120 numeric
);

DROP FUNCTION aged_debt();
CREATE OR REPLACE FUNCTION aged_debt()
  RETURNS SETOF aged_debt
  AS $$
BEGIN
DROP TABLE IF EXISTS aged_debt_t;
CREATE TEMPORARY TABLE aged_debt_t AS SELECT 'i' as type, ci.customerid AS customerid,
CASE WHEN CURRENT_DATE - ci.invoicedate<= 30 THEN 5
WHEN CURRENT_DATE - ci.invoicedate<= 60 THEN 4
WHEN CURRENT_DATE - ci.invoicedate<= 90 THEN 3
WHEN CURRENT_DATE - ci.invoicedate<= 120 THEN 2
WHEN CURRENT_DATE - ci.invoicedate> 120 THEN 1
END AS period,
ROUND(SUM(ci.unpaidamount)/100.00,2) AS amount
FROM accounts.customerinvoices as ci
where ci.unpaidamount > 0
GROUP BY ci.customerid,period
UNION
SELECT 'a' as type, a.customerid,
CASE WHEN CURRENT_DATE - a.applieddate<= 30 THEN 5
WHEN CURRENT_DATE - a.applieddate<= 60 THEN 4
WHEN CURRENT_DATE - a.applieddate<= 90 THEN 3
WHEN CURRENT_DATE - a.applieddate<= 120 THEN 2
WHEN CURRENT_DATE - a.applieddate> 120 THEN 1
END AS period,
ROUND(SUM(a.unallocated)/100.00,2) AS amount
FROM accounts.adjustments as a
where a.unallocated > 0 and a.adjustmenttypeid IN (1,2,3,5)
GROUP BY a.customerid,period
UNION
SELECT 'ac' as type, a.customerid,
CASE WHEN CURRENT_DATE - a.applieddate<= 30 THEN 5
WHEN CURRENT_DATE - a.applieddate<= 60 THEN 4
WHEN CURRENT_DATE - a.applieddate<= 90 THEN 3
WHEN CURRENT_DATE - a.applieddate<= 120 THEN 2
WHEN CURRENT_DATE - a.applieddate> 120 THEN 1
END AS period,
ROUND(SUM(a.unallocated)/100.00,2) *-1 AS amount
FROM accounts.adjustments as a
where a.unallocated > 0 and a.adjustmenttypeid IN (6)
GROUP BY a.customerid,period
UNION
SELECT 'p' as type, cp.customerid,
CASE WHEN CURRENT_DATE - CAST(cp.actualdate AS DATE) <= 30 THEN 5
WHEN CURRENT_DATE - CAST(cp.actualdate AS DATE) <= 60 THEN 4
WHEN CURRENT_DATE - CAST(cp.actualdate AS DATE) <= 90 THEN 3
WHEN CURRENT_DATE - CAST(cp.actualdate AS DATE) <= 120 THEN 2
WHEN CURRENT_DATE - CAST(cp.actualdate AS DATE) > 120 THEN 1
END AS period,
ROUND(SUM(cp.unallocated*-1)/100.00,2) AS amount
from accounts.customerpayments AS cp
where cp.unallocated > 0
GROUP BY cp.customerid,period
order by customerid,period;

RETURN QUERY SELECT  c.customerid, c.customername,
COALESCE((SELECT SUM(amount) from aged_debt_t WHERE aged_debt_t.customerid = c.customerid ),0.0) AS total,
COALESCE((SELECT SUM(amount) from aged_debt_t WHERE aged_debt_t.customerid = c.customerid AND period = 5 ),0.0) AS days030,
COALESCE((SELECT SUM(amount) from aged_debt_t WHERE aged_debt_t.customerid = c.customerid AND period = 4 ),0.0) AS days3060,
COALESCE((SELECT SUM(amount) from aged_debt_t WHERE aged_debt_t.customerid = c.customerid AND period = 3 ),0.0) AS days6090,
COALESCE((SELECT SUM(amount) from aged_debt_t WHERE aged_debt_t.customerid = c.customerid AND period = 2 ),0.0) AS days90120,
COALESCE((SELECT SUM(amount) from aged_debt_t WHERE aged_debt_t.customerid = c.customerid AND period = 1 ),0.0) AS days120
FROM internal.customers AS c
WHERE c.customerid in (select customerid from aged_debt_t GROUP BY customerid)
UNION
SELECT  100000, 'Sub Total',
COALESCE((SELECT SUM(amount) from aged_debt_t ),0.0) AS total,
COALESCE((SELECT SUM(amount) from aged_debt_t WHERE period = 5 ),0.0) AS days030,
COALESCE((SELECT SUM(amount) from aged_debt_t WHERE period = 4 ),0.0) AS days3060,
COALESCE((SELECT SUM(amount) from aged_debt_t WHERE period = 3 ),0.0) AS days6090,
COALESCE((SELECT SUM(amount) from aged_debt_t WHERE period = 2 ),0.0) AS days90120,
COALESCE((SELECT SUM(amount) from aged_debt_t WHERE  period = 1 ),0.0) AS days120
UNION
SELECT  100001, 'Grand Total',
COALESCE((SELECT SUM(amount) from aged_debt_t),0.0) AS total,
0.0 AS days030,
0.0 AS days3060,
0.0 AS days6090,
0.0 AS days90120,
0.0 AS days120
ORDER BY customerid;

END;
$$ LANGUAGE plpgsql;
