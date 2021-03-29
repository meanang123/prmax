-- Function: searchemployeecontactfullext(integer, text, boolean, integer)

-- DROP FUNCTION searchemployeecontactfullext(integer, text, boolean, integer);

CREATE OR REPLACE FUNCTION searchemployeecontactfullext(customerid integer, data text, byemployeeid boolean, logic integer)
  RETURNS bytea AS
$BODY$

    from ttl.plpython import DBCompress
    from prmax.utilities.search import SearchEmployeeContactFullExt

    return DBCompress.encode(SearchEmployeeContactFullExt(SD, plpy,customerid,data,byemployeeid))

$BODY$
  LANGUAGE plpythonu VOLATILE
  COST 100;
ALTER FUNCTION searchemployeecontactfullext(integer, text, boolean, integer) OWNER TO postgres;


-- Function: searchemployeecontactfullextcount(integer, text, boolean, integer)

-- DROP FUNCTION searchemployeecontactfullextcount(integer, text, boolean, integer);

CREATE OR REPLACE FUNCTION searchemployeecontactfullextcount(customerid integer, data text, byemployeeid boolean, logic integer)
  RETURNS integer AS
$BODY$

    from prmax.utilities.search import SearchEmployeeContactFullExt

    return len(SearchEmployeeContactFullExt(SD, plpy,customerid,data,byemployeeid))

$BODY$
  LANGUAGE plpythonu VOLATILE
  COST 100;
ALTER FUNCTION searchemployeecontactfullextcount(integer, text, boolean, integer) OWNER TO postgres;
