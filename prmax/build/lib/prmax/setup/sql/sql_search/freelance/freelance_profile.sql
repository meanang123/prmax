CREATE OR REPLACE FUNCTION SearchFreelanceProfile(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doFreelanceProfile

	return DBCompress.encode(doFreelanceProfile(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchFreelanceProfileCount(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS int
  AS $$

	from prmax.utilities.search import doFreelanceProfile

	return len(doFreelanceProfile(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;
