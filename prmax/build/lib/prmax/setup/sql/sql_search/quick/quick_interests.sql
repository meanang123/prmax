CREATE OR REPLACE FUNCTION SearchInterestsAll(
    customerid INTEGER ,
    data text,
	byemployee boolean,
	logic integer
    )
  RETURNS bytea
  AS $$

	from prmax.utilities.search import doQuickSearch
	from ttl.plpython import DBCompress
	from prmax.utilities.postgres import PostGresControl

	controlSettings = PostGresControl(plpy)

	tmp = doQuickSearch( SD, plpy,customerid,data,True, logic)

	return DBCompress.encode(tmp)


$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchInterestsAllCount(
    customerid INTEGER ,
    data text,
	byemployee boolean,
	logic integer
    )
  RETURNS int
  AS $$

  from prmax.utilities.search import doQuickSearch

  return len(doQuickSearch( SD, plpy,customerid,data,False, logic ))

$$ LANGUAGE plpythonu;

