--

CREATE OR REPLACE function IFNULL (bigint, int4) returns bigint AS '
select coalesce($1, $2) as result
' language 'sql';

CREATE OR REPLACE function IFNULL ( int4,bigint) returns bigint AS '
select coalesce($1, $2) as result
' language 'sql';

CREATE OR REPLACE function IFNULL ( int4,int4) returns bigint AS '
select coalesce($1, $2) as result
' language 'sql';

CREATE OR REPLACE function IFNULL ( bigint,bigint) returns bigint AS '
select coalesce($1, $2) as result
' language 'sql';
