CREATE OR REPLACE FUNCTION get_override(a text,b text,c text,d text )
  RETURNS text
  AS $$
  
  if a:
    return a
  elif b:
    return b
  elif c:
    return c
  elif d:
    return d
  else:
    return  ""
    
$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION get_override(a text,b text )
  RETURNS text
  AS $$
  
  if a:
    return a
  elif b:
    return b
  else:
    return  ""
    
$$ LANGUAGE plpythonu;


CREATE OR REPLACE FUNCTION get_overrideflag(a text,b text,c text,d text )
  RETURNS boolean
  AS $$
  
  if a:
    return True
  elif b:
    return True
  elif c:
    return True
  elif d:
    return False
  else:
    return  False
    
$$ LANGUAGE plpythonu;

CREATE OR REPLACE FUNCTION get_overrideflag(a text,b text )
  RETURNS boolean
  AS $$
  
  if a:
    return True
  elif b:
    return False
  else:
    return  False
    
$$ LANGUAGE plpythonu;

CREATE OR REPLACE FUNCTION get_overrideflag(a integer,b integer )
  RETURNS boolean
  AS $$
  
  if a:
    return True
  elif b:
    return False
  else:
    return  False
    
$$ LANGUAGE plpythonu;