CREATE OR REPLACE FUNCTION SELECTION( 
selection boolean,
selector integer
)
  RETURNS boolean
  AS $$
	if selector==-1:
		return True
	elif selector==0:
		if selection==0:
			return True
	elif selector==1:
		if selection==1:
			return True
			
	return False
	
$$ LANGUAGE plpythonu;
