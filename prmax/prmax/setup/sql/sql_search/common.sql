CREATE OR REPLACE FUNCTION doIndexGroup(
    indexs IndexElement[],
    customerid INTEGER ,
    logic INTEGER ,
    extended INTEGER
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doIndexGroup

	index = doIndexGroup ( SD, plpy,extended,logic,indexs,customerid)
	return DBCompress.encode2(index)

$$ LANGUAGE plpythonu;

CREATE OR REPLACE FUNCTION doIndexGroupCount(
    indexs IndexElement[],
    customerid INTEGER ,
    logic INTEGER ,
    extended INTEGER )
  RETURNS INTEGER
  AS $$

	from prmax.utilities.search import doIndexGroup

	index = doIndexGroup ( SD, plpy,extended,logic,indexs,customerid)
	return len(index )

$$ LANGUAGE plpythonu;
