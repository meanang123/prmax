CREATE OR REPLACE FUNCTION SearchOutletProfile(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doOutletProfile

	return DBCompress.encode(doOutletProfile(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchOutletProfileCount(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS int
  AS $$

	from prmax.utilities.search import doOutletProfile

	return len(doOutletProfile(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;
