CREATE OR REPLACE FUNCTION SearchAdvanceMediaChannel(
    customerid INTEGER ,
    data text,
    byemployeeid boolean,
    logic integer
    )
  RETURNS bytea
  AS $$

	from ttl.plpython import DBCompress
	from prmax.utilities.search import doCommonSearch
	from prmax.utilities.DBIndexer import IndexEntry

	plpy.notice(DBCompress.decode(data))


	outlets = doCommonSearch( DBCompress.decode(data), plpy, byemployeeid )

	index = IndexEntry()
	for row in plpy.execute("SELECT advancefeatureid FROM advancefeatures WHERE outletid IN (SELECT dataid FROM SetToIdList('%s'))" % DBCompress.encode2( outlets[0][0] )):
		index.index.add(row["advancefeatureid"])

	return DBCompress.encode( index )

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchAdvanceMediaChannelCount(
    customerid INTEGER ,
    data text,
    byemployeeid boolean,
    logic integer
)
  RETURNS int
  AS $$

	from prmax.utilities.search import doCommonSearch
	from prmax.utilities.DBIndexer import IndexEntry
	from ttl.plpython import DBCompress

	outlets = doCommonSearch(DBCompress.decode(data), plpy, byemployeeid )

	dataResult = plpy.execute("SELECT advancefeatureid FROM advancefeatures WHERE outletid IN (SELECT dataid FROM SetToIdList('%s'))" % DBCompress.encode2( outlets[0][0] ))
	return len ( dataResult )

$$ LANGUAGE plpythonu;
