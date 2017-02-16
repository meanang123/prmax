CREATE OR REPLACE FUNCTION SearchOutletAdvance(
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

	features = doCommonSearch(DBCompress.decode(data), plpy, byemployeeid )

	index = IndexEntry()
	for row in plpy.execute("SELECT outletid FROM advancefeatures WHERE advancefeatureid IN (SELECT dataid FROM SetToIdList('%s')) GROUP BY outletid" % DBCompress.encode2( features[0][0] )):
		index.index.add(row["outletid"])

	return DBCompress.encode( index )

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchOutletAdvanceCount(
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

	features = doCommonSearch(DBCompress.decode(data), plpy, byemployeeid )

	tmp = DBCompress.decode(data)
	plpy.notice( tmp.rows[0].word ) 

	dataResult = plpy.execute("SELECT outletid FROM advancefeatures WHERE advancefeatureid IN (SELECT dataid FROM SetToIdList('%s'))" % DBCompress.encode2( features[0][0] ))
	return len ( dataResult )

$$ LANGUAGE plpythonu;
