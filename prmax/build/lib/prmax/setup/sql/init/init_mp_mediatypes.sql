INSERT INTO internal.mp_outlettypes(
            mp_outlettypeid, mp_outlettypename)
VALUES (100,'National Television'),
     (200,'Satellite Television'),
     (500,'Local television'),
     (600,'National Radio'),
     (700,'Local Radio'),
     (800,'National Press'),
     (900,'Regional & Local Press'),
     (1100,'Consumer Press'),
     (1200,'Travel Press (Trade)'),
     (1400,'Computing Press'),
     (1500,'Medical Press (Trade)'),
     (1600,'Business Press'),
     (1700,'Trade Press'),
     (1800,'Telecoms & Internet Press'),
     (3100,'Online Media'),
     (3101,'Newswire'),
     (3102,'Portal'),
     (3103,'TV Online'),
     (3104,'Radio Online'),
     (3105,'Journals Online'),
     (3106,'Regional Newspapers Online'),
     (3107,'Magazines Online'),
     (3108,'Online Site Only'),
     (3109,'National Newspapers Online'),
     (3110,'Corporate Site'),
     (3111,'Government Online'),
     (3112,'Broadcast Online'),
     (3113,'Organisations Online'),
     (3114,'Universities Online'),
     (3115,'Blogs'),
     (3116,'User Groups'),
     (3117,'Miscellaneous Online');

     update outlets
set outletsearchtypeid = COALESCE(ot.outletsearchtypeid,ost.outletsearchtypeid)
from outlets as o
join internal.producttypes as ost ON o.producttypeid = ost.producttypeid
left outer join internal.mp_outlettypes as ot on ot.mp_outlettypeid = o.mp_outlettypeid
WHERE outlets.outletid = o.outletid