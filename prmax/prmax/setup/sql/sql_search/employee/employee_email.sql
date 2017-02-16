CREATE OR REPLACE FUNCTION SearchEmployeeEmail(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doEmployeeEmail

	return DBCompress.encode(doEmployeeEmail(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchEmployeeEmailCount(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS int
  AS $$

	from prmax.utilities.search import doEmployeeEmail

	return len(doEmployeeEmail(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;
