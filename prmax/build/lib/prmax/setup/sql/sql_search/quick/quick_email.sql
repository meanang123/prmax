CREATE OR REPLACE FUNCTION SearchQuickEmail(
    customerid INTEGER ,
    data text,
    byemployeeid boolean,
    logic integer
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doQuickEmail

	return DBCompress.encode(doQuickEmail(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchQuickEmailCount(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS int
  AS $$

	from prmax.utilities.search import doQuickEmail

	return len(doQuickEmail(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;
