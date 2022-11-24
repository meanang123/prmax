CREATE OR REPLACE FUNCTION JSON_ENCODE( data text)
  RETURNS text
  AS $$

  if data==None:
    return ""
  else:
    return data.replace('\\','\\').replace('"','\\"')

$$ LANGUAGE plpythonu;
