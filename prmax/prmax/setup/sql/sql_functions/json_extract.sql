CREATE OR REPLACE FUNCTION Json_Extract(
source_string text,
field_name text
)
  RETURNS text
  AS $$

  import simplejson

  obj = simplejson.loads( source_string )

  return obj[field_name]

$$ LANGUAGE plpythonu;