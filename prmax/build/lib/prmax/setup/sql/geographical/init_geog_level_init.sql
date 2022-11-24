
-- INSERT INTO internal.geographicallookuptypes(geographicallookuptypeid, geographicallookupdescription)
--	VALUES (1,'Towns'),(2,'Counties'),(3,'Region'),(4,'TV Region'),(5,'Metropolitan Areas');

BEGIN;
TRUNCATE internal.geographicallookup;
INSERT INTO internal.geographicallookup(geographicallookuptypeid, geographicalid) SELECT 1,* from capture_geographical_level(2416);
INSERT INTO internal.geographicallookup(geographicallookuptypeid, geographicalid) SELECT 2,* from capture_geographical_level(2417);
INSERT INTO internal.geographicallookup(geographicallookuptypeid, geographicalid) SELECT 3,* from capture_geographical_level(2421);
INSERT INTO internal.geographicallookup(geographicallookuptypeid, geographicalid) SELECT 4,* from capture_geographical_level(2422);
INSERT INTO internal.geographicallookup(geographicallookuptypeid, geographicalid) SELECT 5,* from capture_geographical_level(2423);
COMMIT;
-- VACUUM FULL ANALYZE internal.geographicallookup;