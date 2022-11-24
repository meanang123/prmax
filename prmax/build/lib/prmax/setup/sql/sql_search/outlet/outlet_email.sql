CREATE OR REPLACE FUNCTION SearchOutletEmail(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doOutletEmail

	return DBCompress.encode(doOutletEmail(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchOutletEmailCount(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS int
  AS $$

	from prmax.utilities.search import doOutletEmail

	return len(doOutletEmail(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;
