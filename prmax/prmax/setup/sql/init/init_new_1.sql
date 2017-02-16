-- outlet national newsp
begin;
DELETE from outletinterests where outletid in ( select outletid from outlets where prmax_outlettypeid in (1,3) ) ;
INSERT INTO outletinterests(outletid,interestid) select outletid,(select interestid from interests where interestname = 'News - National News')from outlets where prmax_outlettypeid in (1,3);
UPDATE internal.research_control_record SET interests_by_prmax = true WHERE objecttypeid = 1 AND objectid IN (select outletid from outlets where prmax_outlettypeid in (1,3)) ;


-- regional 
DELETE from outletinterests where outletid in ( select outletid from outlets where prmax_outlettypeid in (6,8,9) ) ;
INSERT INTO outletinterests(outletid,interestid) select outletid,(select interestid from interests where interestname = 'News - Regional News')from outlets where prmax_outlettypeid in (6,8,9);
UPDATE internal.research_control_record SET interests_by_prmax = true WHERE objecttypeid = 1 AND objectid IN (select outletid from outlets where prmax_outlettypeid in (6,8,9)) ;

-- Local 
DELETE from outletinterests where outletid in ( select outletid from outlets where prmax_outlettypeid in (10,12) ) ;
INSERT INTO outletinterests(outletid,interestid) select outletid,(select interestid from interests where interestname = 'News - Local News')from outlets where prmax_outlettypeid in (10,12);
UPDATE internal.research_control_record SET interests_by_prmax = true WHERE objecttypeid = 1 AND objectid IN (select outletid from outlets where prmax_outlettypeid in (10,12)) ;

TRUNCATE cache.cachestore;
commit;
 