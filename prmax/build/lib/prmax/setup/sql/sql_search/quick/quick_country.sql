CREATE OR REPLACE FUNCTION SearchQuickCountry(
    customerid INTEGER ,
    data text,
    byemployeeid boolean,
    logic integer
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doQuickCountry

	criteria = DBCompress.decode(data)

	tmpdata = ",".join([str(row) for row in criteria['data']])

	tmp = doQuickCountry(SD, plpy,customerid,tmpdata)

	return DBCompress.encode(tmp)


$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchQuickCountryCount(
    customerid INTEGER ,
    data text,
	byemployeeid boolean,
	logic integer
    )
  RETURNS int
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doQuickCountry

	criteria = DBCompress.decode(data)

	tmpdata = ",".join([str(row) for row in criteria['data']])

	return len(doQuickCountry(SD, plpy,customerid,tmpdata))

$$ LANGUAGE plpythonu;
