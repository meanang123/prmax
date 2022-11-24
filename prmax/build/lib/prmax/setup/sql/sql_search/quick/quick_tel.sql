CREATE OR REPLACE FUNCTION SearchQuickTel(
    customerid INTEGER ,
    data text,
    byemployeeid boolean,
    logic integer
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doQuickTel

	return DBCompress.encode(doQuickTel(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchQuickTelCount(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS int
  AS $$

	from prmax.utilities.search import doQuickTel

	return len(doQuickTel(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;
