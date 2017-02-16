-- select prmax_keywords_init()

CREATE OR REPLACE FUNCTION prmax_keywords_init ()
RETURNS VOID
  AS $$

  plan_add = plpy.prepare("INSERT  INTO interestwords(interestword,interestid) VALUES($1,$2)", [ "text", "int",])
  plan_list = plpy.prepare("SELECT interestid,interestname FROM interests")

  from ttl.string import splitwords,splitwordscompare
  import prmax.Constants as Constants

  plpy.execute("TRUNCATE interestwords")

  for row in plpy.execute(plan_list):
	for field in splitwords(row['interestname']):
		plpy.execute(plan_add,[field,row['interestid']])

$$ LANGUAGE plpythonu;