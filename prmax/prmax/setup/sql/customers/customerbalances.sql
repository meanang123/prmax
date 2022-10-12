CREATE TYPE TypeCustomerBalances AS (
	invoiceamounts bigint, 
	payments bigint,
	adjustmentsplus bigint,
	adjustmentsnegative bigint,
	balance bigint,
	invoiceunpaidamounts bigint, 
	paymentsunallocated bigint,
	adjustmentsplusunalllocated bigint,
	adjustmentsnegativunalllocated bigint
);




CREATE OR REPLACE FUNCTION customerbalance(p_customerid integer)
  RETURNS SETOF TypeCustomerBalances
  AS $$
DECLARE
	p_employeeid bigint;
	p_invoiceamounts bigint;
	p_payments bigint;
	p_adjustments_plus bigint;
	p_adjustments_negative bigint;
	p_invoiceunpaid bigint;
	p_paymentsunallocated bigint;
	p_adjustments_plus_unalllocated bigint;
	p_adjustments_negative_unalllocated bigint;
	
BEGIN

	SELECT COALESCE(SUM(invoiceamount),0), COALESCE(SUM(unpaidamount),0) INTO p_invoiceamounts, p_invoiceunpaid FROM accounts.customerinvoices WHERE customerid = p_customerid;
	SELECT COALESCE(SUM(payment),0), COALESCE(SUM(unallocated),0) INTO p_payments, p_paymentsunallocated FROM accounts.customerpayments WHERE customerid = p_customerid;
	SELECT COALESCE(SUM(amount),0), COALESCE(SUM(unallocated),0) INTO p_adjustments_plus, p_adjustments_plus_unalllocated FROM accounts.adjustments WHERE customerid = p_customerid AND amount > 0;
	SELECT COALESCE(SUM(amount),0), COALESCE(SUM(unallocated),0) INTO p_adjustments_negative, p_adjustments_negative_unalllocated FROM accounts.adjustments WHERE customerid = p_customerid AND amount < 0;

	RETURN QUERY SELECT 
		p_invoiceamounts as invoiceamounts, 
		p_payments as payments,
		p_adjustments_plus as adjustmentsplus,
		p_adjustments_negative as adjustmentsnegative,
		GREATEST((p_invoiceamounts - p_payments + p_adjustments_plus + p_adjustments_negative), 0) as balance,
		p_invoiceunpaid as invoiceunpaidamounts, 
		p_paymentsunallocated as paymentsunallocated,
		p_adjustments_plus_unalllocated as adjustmentsplusunalllocated,
		p_adjustments_negative_unalllocated as adjustmentsnegativunalllocated;
END;
$$ LANGUAGE plpgsql;


CREATE TYPE CustomerBalances_List AS (
	customerid bigint, 
	customername text,
	balance bigint
);

-- DROP FUNCTION all_customerbalance();

CREATE OR REPLACE FUNCTION all_customerbalance()
  RETURNS SETOF CustomerBalances_List
  AS $$
DECLARE
r CustomerBalances_List%rowtype;
t RECORD;
BEGIN 
	for r in select customerid::bigint,customername::text,0::bigint from internal.customers loop
		SELECT * INTO t FROM customerbalance(r.customerid::int);
		r.balance:=t.balance;
		return next r;
	end loop;

	RETURN;
END;
$$ LANGUAGE plpgsql;
