import  csv
import prmax.Constants as Constants
from ttl.postgres import DBConnect

_db =  DBConnect(Constants.db_Command_Service)
c = _db.getCursor()
_db.startTransaction(c)

for row in csv.reader(file(r"C:\Temp\prmax\datasetlayout.csv")):
	if row[0].strip():
		prmaxdatasetid =  int (row[0])
	record = _db.executeOne("select countryid from internal.countries where countryname ilike %(countryname)s", dict(countryname = row[2]))
	c.execute ("INSERT INTO internal.prmaxdatasetcountries(prmaxdatasetid,countryid) VALUES(%(prmaxdatasetid)s,%(countryid)s)",
	           dict (countryid = record[0],
	                 prmaxdatasetid= prmaxdatasetid))
	print "INSERT INTO internal.prmaxdatasetcountries(countryid,prmaxdatasetid) VALUES(%d,%d);" %  (record[0], prmaxdatasetid)

	_db.commitTransaction(c)

_db.Close()