DROP VIEW geographical_lookup_view;

CREATE OR REPLACE VIEW geographical_lookup_view AS SELECT
gl.geographicallookuptypeid,gl.geographicalid,g.geographicalname,lower(g.geographicalname) as cmp_geographicalname
FROM internal.geographicallookup as gl
LEFT JOIN internal.geographical as g ON g.geographicalid = gl.geographicalid
ORDER BY g.geographicalname;

GRANT SELECT ON geographical_lookup_view TO prmax;

-- DROP VIEW geographical_lookup_word_view;
CREATE OR REPLACE VIEW geographical_lookup_word_view AS SELECT
gl.geographicallookuptypeid,gl.geographicalid,g.geographicalname,gw.geographicalword
FROM internal.geographicalwords AS gw
JOIN internal.geographical AS g On gw.geographicalid = g.geographicalid
JOIN internal.geographicallookup AS gl ON gl.geographicalid = g.geographicalid
ORDER BY g.geographicalname;

GRANT SELECT ON geographical_lookup_word_view TO prmax;