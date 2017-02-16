CREATE OR REPLACE FUNCTION SearchAdvancePubDate(
    customerid INTEGER ,
    data text,
    byemployeeid boolean,
    logic integer
    )
  RETURNS bytea
  AS $$

	from prmax.utilities.DBIndexer import IndexEntry
	from ttl.plpython import DBCompress
	import datetime

	ctrl = DBCompress.decode( data )

	command = ""
	command2 = ""

	if ctrl["option"] == "After" :
		command = "SELECT advancefeatureid from advancefeatures where publicationdate_date > '%s' AND publicationdate_partial = false" % datetime.datetime.strptime(ctrl["from_date"],"%Y-%m-%d").strftime("%Y-%m-%d")
		if ctrl["month"]:
			tmp = datetime.datetime.strptime(ctrl["from_date"],"%Y-%m-%d")
			command2 = "SELECT advancefeatureid from advancefeatures where publicationdate_date >= '%s' and publicationdate_partial = true" % datetime.date(tmp.year, tmp.month, 1 ).strftime("%Y-%m-%d")
	elif ctrl["option"] == "Before":
		command = "SELECT advancefeatureid from advancefeatures where publicationdate_date < '%s' AND publicationdate_partial = false" % datetime.datetime.strptime(ctrl["from_date"],"%Y-%m-%d").strftime("%Y-%m-%d")
		if ctrl["month"]:
			tmp = datetime.datetime.strptime(ctrl["from_date"],"%Y-%m-%d")
			command2 = "SELECT advancefeatureid from advancefeatures where publicationdate_date <= '%s' and publicationdate_partial = true" % datetime.date(tmp.year, tmp.month, 28 ).strftime("%Y-%m-%d")
	elif ctrl["option"] == "Between" :
		command = "SELECT advancefeatureid from advancefeatures where publicationdate_date BETWEEN '%s' AND '%s' AND publicationdate_partial = false" % (datetime.datetime.strptime(ctrl["from_date"],"%Y-%m-%d").strftime("%Y-%m-%d"), datetime.datetime.strptime(ctrl["to_date"],"%Y-%m-%d").strftime("%Y-%m-%d") )
		if ctrl["month"]:
			tmp1 = datetime.datetime.strptime(ctrl["from_date"],"%Y-%m-%d")
			tmp2 = datetime.datetime.strptime(ctrl["to_date"],"%Y-%m-%d")
			tmp1 = datetime.date(tmp1.year,tmp1.month,1)
			tmp2 = datetime.date(tmp2.year,tmp2.month,28)

			command += " UNION SELECT advancefeatureid from advancefeatures where publicationdate_date BETWEEN '%s' AND '%s' AND publicationdate_partial = true" % (tmp1.strftime("%Y-%m-%d"), tmp2.strftime("%Y-%m-%d") )

	index = IndexEntry()
	for row in plpy.execute( command ):
		plpy.notice ( row )
		index.index.add( row["advancefeatureid"] )

	if command2:
		for row in plpy.execute( command2 ):
			plpy.notice ( row )
			index.index.add( row["advancefeatureid"] )

	return DBCompress.encode( index )

$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION SearchAdvancePubDateCount(
    customerid INTEGER ,
    data text,
    byemployeeid boolean,
    logic integer
)
  RETURNS int
  AS $$

	from prmax.utilities.DBIndexer import IndexEntry
	from ttl.plpython import DBCompress
	import datetime

	ctrl = DBCompress.decode( data ) ["data"]

	command = ""
	command2 = ""

	if ctrl["option"] == "After" :
		command = "SELECT COUNT(*) from advancefeatures where publicationdate_date > '%s' AND publicationdate_partial = false" % datetime.datetime.strptime(ctrl["from_date"],"%Y-%m-%d").strftime("%Y-%m-%d")
		if ctrl["month"]:
			tmp = datetime.datetime.strptime(ctrl["from_date"],"%Y-%m-%d")
			command2 = "SELECT COUNT(*) from advancefeatures where publicationdate_date >= '%s' and publicationdate_partial = true" % datetime.date(tmp.year, tmp.month, 1 ).strftime("%Y-%m-%d")
	elif ctrl["option"] == "Before":
		command = "SELECT COUNT(*) from advancefeatures where publicationdate_date < '%s' AND publicationdate_partial = false" % datetime.datetime.strptime(ctrl["from_date"],"%Y-%m-%d").strftime("%Y-%m-%d")
		if ctrl["month"]:
			tmp = datetime.datetime.strptime(ctrl["from_date"],"%Y-%m-%d")
			command2 = "SELECT COUNT(*) from advancefeatures where publicationdate_date <= '%s' and publicationdate_partial = true" % datetime.date(tmp.year, tmp.month, 28 ).strftime("%Y-%m-%d")
	elif ctrl["option"] == "Between" :
		command = "SELECT COUNT(*) from advancefeatures where publicationdate_date BETWEEN '%s' AND '%s' AND publicationdate_partial = false" % (datetime.datetime.strptime(ctrl["from_date"],"%Y-%m-%d").strftime("%Y-%m-%d"), datetime.datetime.strptime(ctrl["to_date"],"%Y-%m-%d").strftime("%Y-%m-%d") )
		if ctrl["month"]:
			tmp1 = datetime.datetime.strptime(ctrl["from_date"],"%Y-%m-%d")
			tmp2 = datetime.datetime.strptime(ctrl["to_date"],"%Y-%m-%d")
			tmp1 = datetime.date(tmp1.year,tmp1.month,1)
			tmp2 = datetime.date(tmp2.year,tmp2.month,28)

			command = "SELECT COUNT(*) from advancefeatures WHERE ( publicationdate_date BETWEEN '%s' AND '%s' AND publicationdate_partial = true) OR (publicationdate_date BETWEEN '%s' AND '%s' AND publicationdate_partial = false) " % (tmp1.strftime("%Y-%m-%d"), tmp2.strftime("%Y-%m-%d"),datetime.datetime.strptime(ctrl["from_date"],"%Y-%m-%d").strftime("%Y-%m-%d"), datetime.datetime.strptime(ctrl["to_date"],"%Y-%m-%d").strftime("%Y-%m-%d"))

	results = plpy.execute( command )[0]['count']

	if command2:
		results += plpy.execute( command2 )[0]['count']

	return results

$$ LANGUAGE plpythonu;
