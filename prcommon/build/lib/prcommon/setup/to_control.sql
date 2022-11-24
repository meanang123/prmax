CREATE ROLE prmaxcontrol LOGIN ENCRYPTED PASSWORD 'md58532994d34fb51c17c0bbb5cbff6c83e' VALID UNTIL 'infinity';
GRANT USAGE ON SCHEMA queues,internal,seoreleases,userdata,accounts,cache,research TO prmaxcontrol;
GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public, queues,internal,seoreleases,userdata,accounts,cache,research TO prmaxcontrol;