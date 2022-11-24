CREATE OR REPLACE FUNCTION SearchEmployeeTel(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doEmployeeTel

	return DBCompress.encode(doEmployeeTel(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchEmployeeTelCount(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS int
  AS $$

	from prmax.utilities.search import doEmployeeTel

	return len(doEmployeeTel(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;
