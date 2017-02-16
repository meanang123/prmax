CREATE OR REPLACE FUNCTION SearchFreelanceEmail(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doFreelanceEmail

	return DBCompress.encode(doFreelanceEmail(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchFreelanceEmailCount(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS int
  AS $$

	from prmax.utilities.search import doFreelanceEmail

	return len(doFreelanceEmail(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;
