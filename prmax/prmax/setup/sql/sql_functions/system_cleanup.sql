--

CREATE OR REPLACE FUNCTION SystemCleanUp() returns boolean  AS $$
BEGIN
    DELETE FROM queues.reports WHERE created<=CURRENT_DATE - INTERVAL '7' DAY;

    return TRUE ;
  END;
$$ LANGUAGE plpgsql;


