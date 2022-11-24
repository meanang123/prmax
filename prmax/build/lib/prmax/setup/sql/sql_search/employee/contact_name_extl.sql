CREATE OR REPLACE FUNCTION SearchEmployeeContactExt(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import SearchEmployeeContactExt

	return DBCompress.encode(SearchEmployeeContactExt(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchEmployeeContactExtCount(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS int
  AS $$

	from prmax.utilities.search import SearchEmployeeContactExt

	return len(SearchEmployeeContactExt(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;
