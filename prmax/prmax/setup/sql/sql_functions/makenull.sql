
CREATE OR REPLACE function MAKENULL (text) returns text AS $$
DECLARE
BEGIN
	IF LENGTH($1) = 0 THEN
		RETURN NULL;
	ELSE 
             RETURN $1;
       END IF;
END;       
$$ LANGUAGE plpgsql;