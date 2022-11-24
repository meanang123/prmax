-- Converts the display tel in an easy to search string

DROP FUNCTION IF EXISTS tidy_telephone_for_search(varchar);

CREATE FUNCTION tidy_telephone_for_search(varchar) RETURNS varchar AS $$
BEGIN
    RETURN REPLACE(REPLACE(REPLACE($1,' ',''),'(', ''),')','') ;  
END;
$$ LANGUAGE plpgsql;

