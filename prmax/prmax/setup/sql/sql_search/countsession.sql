CREATE OR REPLACE FUNCTION countSession(commandtext bytea,
p_userid integer,
p_searchtypeid integer,
p_newsession integer,
p_searchtype text)
  RETURNS INTEGER
  AS $$
  DECLARE
  p_return integer;
  BEGIN

  p_return := 0;

  IF p_searchtype='quick' THEN
	SELECT COUNT(*) INTO p_return  FROM doQuickSearch(commandtext) ;
  END IF;
  IF p_searchtype='outlet' THEN
	SELECT COUNT(*) INTO p_return  FROM doOutletSearch(commandtext) ;
  END IF;
  IF p_searchtype='employee' THEN
	SELECT COUNT(*) INTO p_return  FROM doEmployeeSearch(commandtext) ;
  END IF;
  IF p_searchtype='freelance' THEN
	SELECT COUNT(*) INTO p_return  FROM doFreelanceSearch(commandtext) ;
  END IF;
  IF p_searchtype='mps' THEN
	SELECT COUNT(*) INTO p_return  FROM doFreelanceSearch(commandtext) ;
  END IF;

  -- return statistics
  RETURN p_return;

  END;
$$ LANGUAGE plpgsql;
