CREATE OR REPLACE FUNCTION SearchOutletTel(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doOutletTel

	return DBCompress.encode(doOutletTel(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchOutletTelCount(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS int
  AS $$

	from prmax.utilities.search import doOutletTel

	return len(doOutletTel(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;
