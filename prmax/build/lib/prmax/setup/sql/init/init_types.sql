--This is a return list from a search function
CREATE TYPE SearchResult AS (
	outletid integer,
	employeeid integer
);


--This is a return list from a insert into the a searxh session table
CREATE TYPE SearchSessionStatistics AS (
	total bigint,
	appended bigint,
	selected bigint,
	outletid bigint,
	employeeid bigint,
	outlettypeid int,
	customerid int,
	ecustomerid int,
	outletname text,
	contactname text,
	sessionsearchid int,
);

CREATE TYPE SearchSessionStatisticsExt AS (
	total bigint,
	appended bigint,
	selected bigint,
	outletid bigint,
	employeeid bigint,
	outlettypeid int,
	customerid int,
	ecustomerid int,
	outletname text,
	contactname text,
	sessionsearchid int,
	listid int,
	listname text
);

--
CREATE TYPE IndexElement AS (
	keyname text,
	keytype integer
);


CREATE TYPE SetResultData AS (
	bytea text,
	datatypeid integer
);



CREATE TYPE SetResultList AS (
	dataid integer
);