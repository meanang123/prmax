
CREATE OR REPLACE FUNCTION prmax_geographicallookup_init ()
RETURNS VOID
  AS $$

  plan_add = plpy.prepare("INSERT  INTO internal.geographicalwords(geographicalword,geographicalid) VALUES($1,$2)", [ "text", "int",])
  plan_list = plpy.prepare("SELECT gl.geographicalid,g.geographicalname FROM internal.geographicallookup AS gl JOIN internal.geographical AS g ON g.geographicalid = gl.geographicalid")
  
  from ttl.string import splitwords,splitwordscompare
  import prmax.Constants as Constants
  
  for row in plpy.execute(plan_list):
	for field in splitwords(row['geographicalname']):
		plpy.execute(plan_add,[field,row['geographicalid']])
        
$$ LANGUAGE plpythonu;