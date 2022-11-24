CREATE OR REPLACE FUNCTION SearchFreelanceTel(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doFreelanceTel

	return DBCompress.encode(doFreelanceTel(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchFreelanceTelCount(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS int
  AS $$

	from prmax.utilities.search import doFreelanceTel

	return len(doFreelanceTel(SD, plpy,customerid,data,byemployeeid))

$$ LANGUAGE plpythonu;
